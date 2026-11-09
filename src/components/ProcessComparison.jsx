"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const ease = [0.22, 0.61, 0.36, 1];

export default function ProcessComparison({ animate = true }) {
  const sectionRef = useRef(null);
  const [interacted, setInteracted] = useState(false);
  const [position, setPosition] = useState(65);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 38,
    damping: 26,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (!interacted && animate) {
      setPosition(Math.round(78 - v * 56));
    }
  });

  const titleX = useTransform(smoothProgress, [0, 1], [18, -18]);
  const split = animate || interacted ? position : 50;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section-wrap process-comparison"
      aria-labelledby="process-title"
    >
      <motion.div
        className="process-copy"
        initial={
          animate
            ? { opacity: 0, x: -54, filter: "blur(8px)" }
            : false
        }
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: animate ? 1.25 : 0, ease }}
      >
        <span className="eyebrow">05 / HẬU TRƯỜNG & THÀNH PHẨM</span>
        <motion.h2
          id="process-title"
          style={animate ? { x: titleX } : undefined}
        >
          TẠI HIỆN TRƯỜNG.
          <br />
          <span className="accent">LÊN KHUNG HÌNH.</span>
        </motion.h2>
        <div className="process-meta">
          <span>BỘ ẢNH XUÂN THẢO</span>
          <span>CAMERAMAN / PHOTOGRAPHY</span>
        </div>
      </motion.div>
      <motion.figure
        className="process-figure"
        initial={
          animate
            ? {
                opacity: 0,
                scale: 0.92,
                clipPath: "inset(10% 10% 10% 10%)",
                filter: "blur(8px)",
              }
            : false
        }
        whileInView={{
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px)",
        }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{
          duration: animate ? 1.35 : 0,
          delay: animate ? 0.16 : 0,
          ease,
        }}
      >
        <div className="process-view" style={{ "--split": `${split}%` }}>
          <img
            className="process-photo process-final"
            src="/images/final/1U8rQccMMwSc4m8RA27Kt2aSCC3HCtQ_y.jpg"
            alt="Ảnh thành phẩm: người mẫu áo xanh trong không gian xe Xuân Thảo"
            loading="lazy"
            draggable="false"
          />
          <div
            className="process-before"
            style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          >
            <img
              className="process-photo"
              src="/images/backstage/1UUYt3wFip51O86nQRrRClBvIobGS4xl6.jpg"
              alt="Hậu trường ekip ghi hình bên xe Xuân Thảo"
              loading="lazy"
              draggable="false"
            />
          </div>
          <span className="process-label process-label-left">HẬU TRƯỜNG</span>
          <span className="process-label process-label-right">
            ẢNH THÀNH PHẨM
          </span>
          <div className="process-divider" aria-hidden="true">
            <span>‹ ›</span>
          </div>
          <input
            className="process-slider"
            type="range"
            min="0"
            max="100"
            value={split}
            onPointerDown={() => setInteracted(true)}
            onChange={(e) => {
              setInteracted(true);
              setPosition(Number(e.target.value));
            }}
            aria-label="Kéo để so sánh hậu trường và ảnh thành phẩm"
            aria-valuetext={`${split}% hậu trường, ${100 - split}% thành phẩm`}
          />
        </div>
        <figcaption>
          <span>HAI GÓC NHÌN CỦA MỘT BUỔI GHI HÌNH</span>
          <span>KÉO HOẶC CUỘN ĐỂ KHÁM PHÁ ↔</span>
        </figcaption>
      </motion.figure>
    </section>
  );
}
