import { useState, useMemo, useRef } from "react";
import { Loader, PrimaryButton } from "../components";
import { useFetch } from "../hooks";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import {
  motion,
  useWillChange,
} from "framer-motion";
import { ProductCarousel } from ".";
import CategoriesContainerNew from "../components/categories/CategoriesContainerNew";

const windowWidth = window.innerWidth;

const CategoriesNew = () => {
  const willChange = useWillChange()
  const [data] = useFetch<string[]>("/categories");
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const parentRef = useRef<HTMLElement | null>(null);
  const categories = useMemo(() => {
    return !data
      ? []
      : [
          { name: "Electronics", array: [data[0], data[1]] },
          { name: "Self Care", array: [data[2], data[3], data[16]] },
          { name: "Decor Accessories", array: [data[5], data[6], data[19]] },
          { name: "Clothes", array: [data[7]] },
          { name: "Auto", array: [data[17], data[18]] },
        ];
  }, [data]);

  const categoriesByGender = useMemo(() => {
    return !data
      ? []
      : [
          {
            name: "Women",
            array: [data[8], data[9], data[13], data[14], data[15]],
            headingClassname: "text-pink-700 text-center",
          },
          {
            name: "Men",
            array: [data[10], data[11], data[12]],
            headingClassname: "text-red-700 text-center",
          },
        ];
  }, [data]);

  const visibleCategories = seeAll ? categories : categories.slice(0, 2);

  if (!data)
    return (
      <section className=" h-[10rem] relative mt-2 mx-4 w-[calc(100vw-2.75rem)] bg-white p-3 overflow-hidden  flex items-center justify-center">
        <Loader className="h-[3rem] w-[3rem]" />
      </section>
    );

  return (
    <>
        <motion.section
          style={{
            willChange
          }}
          layoutRoot
          initial={false}
          animate={{
            height: seeAll ? "auto" : windowWidth > 1024 ? "20rem" : "24rem",
            gridTemplateRows : seeAll ? '1fr' : '0fr',
            transform:''
          }}
        //   ref={parentRef}
          className={`grid parentSection  mt-2 mx-4 bg-white overflow-hidden`}
          transition={{ duration: 0.3, repeatType: "mirror", ease:'linear' }}
        >
          <div className={`p-3`}>
            {/* category by name */}
            <h3 className="font-bold text-center text-xl drop-shadow-lg">
              Shop by Category
            </h3>
            
              {/* <div> */}
                {visibleCategories.map((category) => {
                  const { name, array } = category;
                  return (
                    <CategoriesContainerNew
                      key={name}
                      categoryName={name}
                      dataArray={array}
                      initialAnimation={false}
                      willExit={false}
                      layoutDependency={visibleCategories.length}
                    />
                  );
                })}
                {/* </div> */}

                {seeAll && (
                  <h3
                    key={"shopByGenderHeading"}
                    className="font-bold text-center text-xl drop-shadow-lg mt-8 overflow-hidden"
                  >
                    Shop by Gender
                  </h3>
                )}

                {/* category by gender */}
                {seeAll &&
                  categoriesByGender.map((category) => {
                    const { name, array, headingClassname } = category;
                    return (
                      <CategoriesContainerNew
                        key={name}
                        categoryName={name}
                        dataArray={array}
                        headingClassname={
                          headingClassname ? headingClassname : ""
                        }
                        willExit={true}
                      />
                    );
                  })}

                {/* see-more/less button */}
                <div
                  key={"seeAllButton"}
                  className=" w-full flex justify-center overflow-hidden"
                >
                  <PrimaryButton
                    onClick={() => {
                      setSeeAll((seeAll) => !seeAll);
                      const parentRefCoords = parentRef.current?.offsetTop;
                      if (seeAll && parentRef && parentRefCoords)
                        window.scrollTo(0, parentRefCoords - 100);
                    }}
                    text={seeAll ? "See Less" : "See All"}
                    Icon={
                      seeAll
                        ? MdOutlineKeyboardArrowUp
                        : MdOutlineKeyboardArrowDown
                    }
                  />
                </div>
          </div>
        </motion.section>
        <ProductCarousel category="laptops" />
    </>
  );
};

export default CategoriesNew