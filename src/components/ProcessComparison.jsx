"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function ProcessComparison({ animate = true }) {
  const sectionRef = useRef(null);
  const [interacted, setInteracted] = useState(false);
  const [position, setPosition] = useState(65);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!interacted && animate) {
      setPosition(Math.round(90 - v * 80));
    }
  });

  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
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
        initial={animate ? { opacity: 0, y: 32 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: animate ? 0.75 : 0, ease }}
      >
        <span className="eyebrow">04 / HẬU TRƯỜNG & THÀNH PHẨM</span>
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
        initial={animate ? { opacity: 0, y: 32 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{
          duration: animate ? 0.75 : 0,
          delay: animate ? 0.1 : 0,
          ease,
        }}
      >
        <div className="process-view" style={{ "--split": `${split}%` }}>
          <img
            className="process-photo process-final"
            src="/images/final/1vBu1j_WEiHw_KCDFRl799zLYCHLNQpU1.jpg"
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
