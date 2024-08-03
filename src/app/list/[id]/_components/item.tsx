"use client";

import {
  FormEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  FaRegTrashAlt as DeleteIcon,
  FaExternalLinkAlt as ExternalIcon,
} from "react-icons/fa";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useDeleteItem, useEditItem } from "../_hooks";
import cn from "classnames";
import { createPortal } from "react-dom";
import Link from "next/link";

type ItemProps = {
  id: string;
  listId: string;
  text?: string;
  image?: { url: string; name: string };
};
const Item = ({ id, listId, text, image }: ItemProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  const { mutate: deleteItem } = useDeleteItem(listId);
  const { mutate: editItem, isPending } = useEditItem(listId);

  const handleEditItem = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newText = inputRef.current?.value.trim();
      if (!newText || newText === text) return;

      inputRef?.current?.blur();
      editItem({ id: id as Id<"items">, newText });
    },
    [editItem, text, id],
  );

  const handleDeleteItem = useCallback(() => {
    deleteItem({ id: id as Id<"items"> });
  }, [deleteItem, id]);

  useEffect(() => {
    formRef?.current?.reset();
  }, [text]);

  return (
    <motion.li layout transition={{ type: "spring" }}>
      <SwipeableContainer
        draggable={!editing && !isPending}
        onSwipe={handleDeleteItem}
      >
        {text !== undefined && (
          <form ref={formRef} onSubmit={handleEditItem}>
            <input
              defaultValue={text}
              ref={inputRef}
              onFocus={() => setEditing(true)}
              onBlur={() => {
                setEditing(false);
                formRef?.current?.reset();
              }}
              className={cn(
                "w-full bg-gray-50 px-2 py-1 outline-none dark:bg-zinc-900 dark:text-gray-50",
                isPending ? "text-gray-500" : "text-black",
              )}
            />
          </form>
        )}
        {image && <ZoomableImage src={image.url} name={image.name} />}
      </SwipeableContainer>
    </motion.li>
  );
};

type SwipeableContainerProps = {
  draggable: boolean;
  onSwipe: () => void;
} & PropsWithChildren;
const SwipeableContainer = ({
  draggable,
  onSwipe,
  children,
}: SwipeableContainerProps) => {
  const DRAG_THRESHOLD = 100;

  return (
    <div className="relative">
      <motion.div
        className="absolute inset-[1px] -z-10 flex flex-row items-center justify-end bg-red-500 font-bold text-white"
        exit={{
          translateX: "-100%",
          transition: { delay: 0.15, duration: 0.1 },
        }}
      >
        <DeleteIcon className="mr-2 text-lg" />
      </motion.div>
      <motion.div
        drag={draggable && "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.3 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 0) return;
          if (Math.abs(info.offset.x) >= DRAG_THRESHOLD) onSwipe();
        }}
        exit={{ translateX: "-100%", transition: { duration: 0.2 } }}
        className="bg-gray-50 dark:bg-zinc-900"
      >
        {children}
      </motion.div>
    </div>
  );
};

const ZoomableImage = ({ src, name }: { src: string; name: string }) => {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [active, setActive] = useState(false);

  const animate = useMemo(() => {
    if (zoomedIn) return { scale: 2 };
    else return { scale: 1, x: 0, y: 0 };
  }, [zoomedIn]);

  const imgRef = useRef<HTMLImageElement>(null);

  const dragControls = useDragControls();

  return (
    <>
      <img
        src={src}
        className="w-full max-w-md cursor-pointer px-2 py-1"
        onClick={() => setActive(true)}
      />
      <>
        {createPortal(
          <AnimatePresence>
            {active && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Link
                  href={src}
                  target="_blank"
                  className="absolute top-4 z-50 text-white"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 100 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-row items-center gap-4"
                  >
                    {name}
                    <ExternalIcon className="text-accent" />
                  </motion.span>
                </Link>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: "80%" }}
                  exit={{ opacity: 0, transition: { delay: 0.1 } }}
                  className="absolute inset-0 z-40 cursor-pointer bg-black"
                  onClick={() => {
                    setActive(false);
                    setZoomedIn(false);
                  }}
                  onPointerDown={e => dragControls.start(e)}
                />
                <motion.img
                  layout
                  src={src}
                  initial={{ scale: 0 }}
                  animate={animate}
                  exit={{ scale: 0 }}
                  className={cn(
                    "z-50 object-scale-down",
                    zoomedIn ? "cursor-zoom-out" : "cursor-zoom-in",
                  )}
                  onClick={() => setZoomedIn(prev => !prev)}
                  drag={zoomedIn}
                  dragControls={dragControls}
                  dragConstraints={{
                    left: window.screenLeft - (imgRef.current?.width ?? 0),
                    right: window.screenX + (imgRef.current?.width ?? 0),
                    top: window.screenY - (imgRef.current?.height ?? 0),
                    bottom: window.screenY + (imgRef.current?.height ?? 0),
                  }}
                  dragElastic={{ left: 0.1, right: 0.1, top: 0.1, bottom: 0.1 }}
                  dragMomentum={false}
                  ref={imgRef}
                />
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </>
    </>
  );
};

export default Item;
