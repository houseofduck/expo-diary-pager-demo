import React, { useRef, useState, useCallback, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { format, addDays, parseISO, isValid } from "date-fns";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { z } from "zod";
import { TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";

async function mockDataFetch(date: string) {
  console.log("fetching data for", date);
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      resolve(randomNumber);
    }, 500);
  });
}

const LazyLoadView = React.memo(
  ({
    date,
    currentIndex,
    setDayValue,
    index,
    styles,
  }: {
    date: Date;
    currentIndex: number;
    index: number;
    styles: any;
    setDayValue: (day: string) => void;
  }) => {
    const shouldRefetch = currentIndex === index;

    const { data, refetch } = useQuery({
      queryKey: ["day", format(date, "yyyy-MM-dd"), index],
      queryFn: () => mockDataFetch(format(date, "yyyy-MM-dd")),
      enabled: shouldRefetch,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

    useEffect(() => {
      if (shouldRefetch) {
        refetch();
      }
    }, [shouldRefetch, refetch]);

    if (Math.abs(currentIndex - index) > 2) {
      return <View style={styles.lazyPlaceholder} />;
    }

    function handleRouteAndSetDayValue(day: string) {
      router.push(`/diary/${day}`);
      setDayValue(day);
    }

    return (
      <View style={styles.pageContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handleRouteAndSetDayValue("2021-01-05")}>
            <Text>Go to 5th of January 2021</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRouteAndSetDayValue("2023-01-05")}>
            <Text>Go to 5th of January 2023</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRouteAndSetDayValue("today")}>
            <Text>Go to today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRouteAndSetDayValue("tomorrow")}>
            <Text>Go to tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRouteAndSetDayValue("yesterday")}>
            <Text>Go to yesterday</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

type DiaryDayType = {
  day: "today" | "yesterday" | "tomorrow" | string;
};

const dateSchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format. Expected YYYY-MM-DD",
  }),
  z.enum(["today", "tomorrow", "yesterday"]),
]);

const DiaryDay = () => {
  const { day } = useLocalSearchParams<{ day: string }>();
  const pagerRef = useRef<PagerView>(null);
  const [dayValue, setDayValue] = useState<string>(day || new Date().toISOString());
  const [currentIndex, setCurrentIndex] = useState(2);
  const [buffer, setBuffer] = useState([-2, -1, 0, 1, 2]);

  const bufferSize = buffer.length;

  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const getInitialDate = useCallback(() => {
    const today = normalizeDate(new Date());
    switch (dayValue) {
      case "today":
        return today;
      case "yesterday":
        return addDays(today, -1);
      case "tomorrow":
        return addDays(today, 1);
      default:
        return parseISO(dayValue);
    }
  }, [dayValue]);

  const getDateForIndex = useCallback(
    (offset: number) => {
      const baseDate = getInitialDate();
      return addDays(baseDate, offset);
    },
    [getInitialDate]
  );

  const updateBufferForNewDate = useCallback(
    (newDayValue: string) => {
      const today = normalizeDate(new Date());
      let newDate;
      if (newDayValue === "today") {
        newDate = today;
      } else if (newDayValue === "yesterday") {
        newDate = addDays(today, -1);
      } else if (newDayValue === "tomorrow") {
        newDate = addDays(today, 1);
      } else {
        newDate = parseISO(newDayValue);
      }

      if (!isValid(newDate)) return;

      const newBuffer = Array.from(
        { length: bufferSize },
        (_, i) => i - Math.floor(bufferSize / 2)
      );
      setBuffer(newBuffer);

      if (pagerRef.current) {
        setTimeout(() => {
          pagerRef.current?.setPage(Math.floor(bufferSize / 2));
          setCurrentIndex(Math.floor(bufferSize / 2));
        }, 0);
      }
    },
    [bufferSize]
  );

  const onPageSelected = useCallback(
    (e: PagerViewOnPageSelectedEvent) => {
      const newIndex = e.nativeEvent.position;

      if (newIndex === 0 || newIndex === bufferSize - 1) {
        let newBuffer = [...buffer];
        if (newIndex === bufferSize - 1) {
          newBuffer = newBuffer.map((index) => index + 1);
        } else if (newIndex === 0) {
          newBuffer = newBuffer.map((index) => index - 1);
        }

        setBuffer(newBuffer);

        setTimeout(() => {
          if (newIndex === 0) {
            pagerRef.current?.setPageWithoutAnimation(1);
            setCurrentIndex(1);
          } else if (newIndex === bufferSize - 1) {
            pagerRef.current?.setPageWithoutAnimation(bufferSize - 2);
            setCurrentIndex(bufferSize - 2);
          }
        }, 0);
      } else {
        setCurrentIndex(newIndex);
      }
    },
    [buffer, bufferSize]
  );

  useEffect(() => {
    const initialBuffer = buffer.map((offset) => offset);
    setBuffer(initialBuffer);
    setCurrentIndex(2);
  }, [getInitialDate]);

  useEffect(() => {
    if (typeof dayValue === "string" && dateSchema.safeParse(dayValue).success) {
      updateBufferForNewDate(dayValue);
    }
  }, [dayValue, updateBufferForNewDate]);

  return (
    <PagerView
      style={styles.pagerView}
      initialPage={currentIndex}
      onPageSelected={onPageSelected}
      ref={pagerRef}
    >
      {buffer.map((offset, idx) => (
        <LazyLoadView
          key={idx}
          setDayValue={setDayValue}
          date={getDateForIndex(offset)}
          index={idx}
          currentIndex={currentIndex}
          styles={styles}
        />
      ))}
    </PagerView>
  );
};

export default DiaryDay;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    color: "#000000",
    paddingBottom: 20,
  },
  lazyPlaceholder: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
