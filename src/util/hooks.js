import { useEffect, useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onArrayChange = (event) => {
    // const newValues = [...values];
    var list = values[event.target.name];

    let index = 0;

    if (event.target.checked) {
      if (!list.includes(event.target.value)) {
        list = [...list, event.target.value];
      }
    } else {
      index = list.indexOf(event.target.value);
      list.splice(index, 1);
    }

    list.sort();
    setValues({ ...values, [event.target.name]: list });
  };

  const onChange = (event) => {
    // event.preventDefault();
    // event.stopPropagation();
    if (event.target.type === "number") {
      const numberValue = parseInt(event.target.value, 10);

      setValues({
        ...values,
        [event.target.name]: numberValue,
      });
    } else if (event.target.type === "checkbox") {
      if (event.target.checked) {
        setValues({ ...values, [event.target.name]: true });
      } else {
        setValues({ ...values, [event.target.name]: false });
      }
      // }else{}
    } else if (event.target.name === "typeOfDiscount") {
      setValues({
        ...values,
        [event.target.name]: parseInt(event.target.value) || 0,
      });
    } else {
      setValues({ ...values, [event.target.name]: event.target.value });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    event.stopPropagation();
    callback();
  };

  // const counterClickCallback = (targetInputName) => {

  // };

  return {
    onChange,
    onSubmit,
    // onCounterClick,
    onArrayChange,
    values,
    setValues,
    // onDrop,
  };
};

export const checkIsDarkMode = () => {
  return (
    window.matchMedia("(prefers-color-scheme: dark)") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

export const useWindowSize = () => {
  const isClient = typeof window === "object";

  // function getSize() {
  //   return {
  //     width: isClient ? window.innerWidth : undefined,
  //     height: isClient ? window.innerHeight : undefined,
  //   };
  // }

  const screenSize = {
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  };

  const [windowSize, setWindowSize] = useState(screenSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      const screenSize = {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined,
      };
      setWindowSize(screenSize);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

const SCROLL_UP = "up";
const SCROLL_DOWN = "down";

export const useScrollDirection = ({
  initialDirection,
  thresholdPixels,
  off,
} = {}) => {
  const [scrollDir, setScrollDir] = useState(initialDirection);

  useEffect(() => {
    const threshold = thresholdPixels || 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // We haven't exceeded the threshold
        ticking = false;
        return;
      }
      // console.log(scrollY);
      setScrollDir(scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    /**
     * Bind the scroll handler if `off` is set to false.
     * If `off` is set to true reset the scroll direction.
     */
    !off
      ? window.addEventListener("scroll", onScroll)
      : setScrollDir(initialDirection);

    return () => window.removeEventListener("scroll", onScroll);
  }, [initialDirection, thresholdPixels, off]);

  return scrollDir;
};
