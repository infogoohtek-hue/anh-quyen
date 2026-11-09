"use client";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  Menu,
  X,
  Plus,
  Minus,
  Pause,
  Play,
  Search,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import {
  profile,
  education,
  hardSkills,
  softSkills,
  tools,
  careerGoals,
  experiences,
  highlights,
  projects,
  featuredProjects,
  categories,
  services,
  backstage,
} from "../data/portfolio";

import ProcessComparison from "./ProcessComparison";
import { footerVideo } from "../data/footer-video";

const nav = [
  ["portfolio", "Tác phẩm"],
  ["expertise", "Chuyên môn"],
  ["about", "Về tôi"],
  ["experience", "Kinh nghiệm"],
  ["backstage", "Hậu trường"],
  ["contact", "Liên hệ"],
];

export const AnimationContext = createContext(true);
export const ease = [0.22, 0.61, 0.36, 1];

const revealVariants = {
  "fade-up": {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  heading: {
    hidden: {
      opacity: 0,
      y: 46,
      scale: 0.96,
      rotateX: 14,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
    },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -54, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 54, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "scale-up": {
    hidden: { opacity: 0, y: 36, scale: 0.9, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  },
  "quote-card": {
    hidden: {
      opacity: 0,
      x: 44,
      y: 32,
      rotateY: -14,
      scale: 0.92,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateY: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  },
  "video-swing": {
    hidden: {
      opacity: 0,
      x: 52,
      y: 40,
      rotate: 9,
      scale: 0.88,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  },
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 1.2,
  as = "div",
  layout = false,
  variant = "fade-up",
}) {
  const animate = useContext(AnimationContext);
  const Element = motion[as];
  const selectedVariant = revealVariants[variant] || revealVariants["fade-up"];
  return (
    <Element
      className={className}
      layout={animate && layout}
      initial={animate ? selectedVariant.hidden : false}
      whileInView={selectedVariant.visible}
      viewport={{ once: false, amount: 0.14 }}
      exit={{ opacity: 0, y: animate ? 14 : 0 }}
      transition={{
        duration: animate ? duration : 0,
        delay: animate ? delay : 0,
        ease,
      }}
    >
      {children}
    </Element>
  );
}

function MediaImage({ src, alt, className = "", priority = false, ...props }) {
  const [status, setStatus] = useState("loading");
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    setStatus(
      img?.complete ? (img.naturalWidth ? "loaded" : "error") : "loading",
    );
  }, [src]);
  return (
    <span className={`media-image ${status} ${className}`}>
      {status === "error" && (
        <span className="image-fallback">
          <span className="display">AQ.</span>
          <span>Không thể tải ảnh xem trước</span>
        </span>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        width={1400}
        height={990}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...props}
      />
    </span>
  );
}

function MagneticLink({ children, ...props }) {
  const enabled = useContext(AnimationContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  useEffect(() => {
    if (!enabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, x, y]);
  return (
    <motion.a
      {...props}
      style={{ x: enabled ? x : 0, y: enabled ? y : 0 }}
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.12);
        y.set((e.clientY - r.top - r.height / 2) * 0.2);
      }}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.a>
  );
}

const ProjectCard = forwardRef(function ProjectCard(
  { project, index, onOpen },
  forwardedRef,
) {
  const animate = useContext(AnimationContext);
  const cardRef = useRef(null);
  const setRefs = useCallback(
    (node) => {
      cardRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const y = useSpring(rawY, { stiffness: 50, damping: 24, restDelta: 0.001 });
  const isVideo = project.type === "video";
  const col = index % 3;
  const colOffset = col === 0 ? -28 : col === 2 ? 28 : 0;
  const colRotate = col === 0 ? 5 : col === 2 ? -5 : 0;

  return (
    <motion.article
      ref={setRefs}
      className="project-card"
      layout={animate}
      initial={
        animate
          ? {
              opacity: 0,
              x: colOffset,
              y: 52,
              scale: 0.92,
              rotateY: colRotate,
              filter: "blur(7px)",
            }
          : false
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: animate ? 1.25 : 0,
        delay: animate ? col * 0.13 : 0,
        ease,
      }}
      exit={{ opacity: 0, scale: animate ? 0.94 : 1 }}
    >
      <button
        className="project-open"
        onClick={() => onOpen(project)}
        aria-label={`Xem ${project.title}`}
      >
        <motion.div
          className="project-picture"
          style={animate ? { y } : undefined}
          initial={
            animate
              ? { clipPath: "inset(12% 8% 12% 8%)", scale: 1.12 }
              : false
          }
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{
            duration: animate ? 1.35 : 0,
            delay: animate ? col * 0.13 + 0.05 : 0,
            ease,
          }}
        >
          <MediaImage src={project.image} alt={project.title} />
        </motion.div>
        <span className="project-type">{project.category}</span>
        <span className="project-hover">
          {isVideo ? (
            <Play fill="currentColor" size={18} />
          ) : (
            <ArrowUpRight size={22} />
          )}
        </span>
        <span className="project-frame" aria-hidden="true" />
      </button>
      <button className="project-caption" onClick={() => onOpen(project)}>
        <span className="project-number display">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span>
          <h3>{project.title}</h3>
          <span className="project-category">{project.category}</span>
        </span>
        <ArrowUpRight size={20} />
      </button>
    </motion.article>
  );
});

function BackstageCard({ item, index, onOpen }) {
  const animate = useContext(AnimationContext);
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const y = useSpring(rawY, { stiffness: 50, damping: 24, restDelta: 0.001 });
  const col = index % 3;
  const tilt = index % 2 === 0 ? -2.2 : 2.2;

  return (
    <motion.button
      ref={cardRef}
      className="backstage-card"
      onClick={() => onOpen(item)}
      aria-label={"Xem " + item.title}
      initial={
        animate
          ? {
              opacity: 0,
              y: 48,
              scale: 0.91,
              rotateZ: tilt,
              filter: "blur(6px)",
            }
          : false
      }
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: animate ? 1.25 : 0,
        delay: animate ? col * 0.14 : 0,
        ease,
      }}
    >
      <div className="backstage-media">
        <motion.div
          className="backstage-parallax"
          style={animate ? { y } : undefined}
          initial={
            animate
              ? { clipPath: "inset(14% 6% 14% 6%)", scale: 1.14 }
              : false
          }
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{
            duration: animate ? 1.35 : 0,
            delay: animate ? col * 0.14 + 0.06 : 0,
            ease,
          }}
        >
          <img src={item.image} alt={item.title} loading="lazy" />
        </motion.div>
      </div>
      <span>
        ON SET / {String(index + 1).padStart(2, "0")}{" "}
        <ArrowUpRight size={16} />
      </span>
    </motion.button>
  );
}

function ProjectDialog({ project, onClose }) {
  const animate = useContext(AnimationContext);
  const panel = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const isVideo = project.type === "video";

  useEffect(() => {
    const before = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = [
          ...panel.current.querySelectorAll(
            "button, a[href], input, select, textarea, iframe",
          ),
        ].filter((el) => !el.disabled && el.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panel.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", key);
      before?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 14000);
    return () => clearTimeout(timer);
  }, [loaded, retry, isVideo, project.id]);

  return (
    <motion.div
      className="dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: animate ? 0.25 : 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.section
        initial={animate ? { opacity: 0, y: 45, scale: 0.97 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: animate ? 20 : 0 }}
        transition={{ duration: animate ? 0.45 : 0, ease }}
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="project-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-heading">
          <span className="eyebrow">{project.category}</span>
          <button
            className="icon-button"
            aria-label="Đóng tác phẩm"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {isVideo ? (
          <div className="dialog-media">
            {!loaded && (
              <div className="media-loading" role="status">
                {failed ? (
                  <>
                    <p>
                      Bản xem trước chưa thể tải. Hãy mở trên Google Drive để
                      xem trực tiếp.
                    </p>
                    <button
                      className="outline-button"
                      onClick={() => {
                        setFailed(false);
                        setLoaded(false);
                        setRetry((r) => r + 1);
                      }}
                    >
                      Thử lại
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={
                        animate ? "loading-ring" : "loading-ring paused"
                      }
                    />
                    <p>Đang tải video…</p>
                  </>
                )}
              </div>
            )}
            <iframe
              key={`${project.id}-${retry}`}
              className="video-preview"
              src={`https://drive.google.com/file/d/${project.id}/preview`}
              title={project.title}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                setLoaded(true);
                setFailed(false);
              }}
              onError={() => setFailed(true)}
            />
          </div>
        ) : (
          <div className="trile-dialog-image">
            {(
              project.gallery ?? [
                { image: project.image, caption: project.title },
              ]
            ).map((item) => (
              <figure className="trile-gallery-page" key={item.image}>
                <img
                  src={item.image}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  width={1400}
                  height={990}
                />
                {project.gallery && (
                  <figcaption>
                    {item.caption}{" "}
                    <a href={item.image} target="_blank" rel="noreferrer">
                      Xem ảnh gốc ↗
                    </a>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
        <div className="dialog-description">
          <div>
            <h2 id="dialog-title">{project.title}</h2>
            <span className="accent">{project.role}</span>
            <p>{project.description}</p>
          </div>
          <a
            className="outline-button"
            href={project.source || project.image}
            target="_blank"
            rel="noreferrer"
          >
            Xem trên Drive <ExternalLink size={16} />
          </a>
        </div>
      </motion.section>
    </motion.div>
  );
}

function Avatar() {
  const [failed, setFailed] = useState(false);
  return profile.avatar && !failed ? (
    <img
      src={profile.avatar}
      alt="Chân dung Huỳnh Anh Quyền"
      width={1086}
      height={1448}
      onError={() => setFailed(true)}
      fetchPriority="high"
    />
  ) : (
    <div
      className="avatar-placeholder"
      aria-label="Ảnh chân dung sẽ được bổ sung"
    >
      <span className="avatar-cross">+</span>
      <span className="display">
        AQ<span className="accent">.</span>
      </span>
      <small>
        HUỲNH ANH QUYỀN
        <br />
        CAMERAMAN & EDITOR
      </small>
      <span className="avatar-frame">[ BEHIND THE LENS ]</span>
    </div>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false),
    [enabled, setEnabled] = useState(true),
    [activeSection, setActiveSection] = useState("home"),
    [category, setCategory] = useState("Tất cả"),
    [query, setQuery] = useState(""),
    [all, setAll] = useState(false),
    [openExp, setOpenExp] = useState(0),
    [selected, setSelected] = useState(null);
  const reduced = useReducedMotion(),
    { scrollYProgress } = useScroll();
  const animate = enabled && !reduced;
  const hero = useRef(null);
  const aboutRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: rawAboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start 75%", "end 75%"],
  });
  const aboutProgress = useSpring(rawAboutProgress, {
    stiffness: 45,
    damping: 24,
    restDelta: 0.001,
  });
  const titleY = useTransform(heroProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(heroProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const introY = useTransform(heroProgress, [0, 1], [0, -55]);
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });
  const closeProject = useCallback(() => setSelected(null), []);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem("anhquyen-motion") !== "off");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion =
      enabled && !reduced ? "on" : "off";
  }, [enabled, reduced]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }),
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const orderedProjects = [
    ...featuredProjects,
    ...projects.filter((project) => !featuredProjects.includes(project)),
  ];
  const filtered = orderedProjects.filter(
    (p) =>
      (category === "Tất cả" || p.category === category) &&
      `${p.title} ${p.category}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  const shown =
    !all && category === "Tất cả" && !query ? featuredProjects : filtered;
  const open = (p) => setSelected(p);

  return (
    <AnimationContext.Provider value={animate}>
      <MotionConfig
        reducedMotion={animate ? "user" : "always"}
        transition={{ duration: animate ? 1.0 : 0, ease }}
      >
        <a className="skip-link" href="#portfolio">
          Đến tác phẩm
        </a>
        <motion.div
          className="reading-progress"
          style={{ scaleX: animate ? progress : scrollYProgress }}
        />
        <header className="site-header">
          <a className="wordmark" href="#home">
            ANH QUYỀN<span>©</span>
          </a>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? "active" : ""}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="motion-toggle"
              onClick={() => {
                setEnabled(!enabled);
                try {
                  localStorage.setItem(
                    "anhquyen-motion",
                    enabled ? "off" : "on",
                  );
                } catch {}
              }}
              aria-pressed={!animate}
            >
              {animate ? <Pause size={12} /> : <Play size={12} />} Motion{" "}
              {animate ? "on" : "off"}
            </button>
            <a className="header-contact" href="#contact">
              Kết nối <ArrowUpRight size={17} />
            </a>
            <button
              className="menu-toggle icon-button"
              aria-label={menu ? "Đóng menu" : "Mở menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={animate ? { opacity: 0, y: -12 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: animate ? -12 : 0 }}
              transition={{ duration: animate ? 0.25 : 0 }}
              className="mobile-menu trile-mobile-menu"
              aria-label="Điều hướng di động"
            >
              {nav.map(([id, label], i) => (
                <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
                  <small>0{i + 1}</small>
                  {label}
                  <ArrowUpRight />
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <main>
          <section id="home" className="hero" ref={hero}>
            <div className="hero-top">
              <span>
                CAMERAMAN · EDITOR · MEDIA CONTENT
                <br />
                FILM · EVENT · PHOTOGRAPHY
              </span>
              <span className="availability">
                <i />
                THỰC TẬP SINH MEDIA (CONTENT / VIDEO)
              </span>
            </div>
            <motion.div
              className="hero-title display"
              aria-hidden="true"
              style={animate ? { y: titleY } : undefined}
              initial={animate ? { clipPath: "inset(0 0 100% 0)" } : false}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: animate ? 1.4 : 0, ease }}
            >
              PORTFOLIO
            </motion.div>
            <motion.div
              className="hero-portrait trile-portrait"
              style={
                animate ? { y: portraitY, scale: portraitScale } : undefined
              }
              initial={animate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{
                duration: animate ? 1.2 : 0,
                delay: animate ? 0.2 : 0,
              }}
            >
              <div className="portrait-crop">
                <Avatar />
              </div>
            </motion.div>
            <motion.div
              className="hero-intro"
              style={animate ? { y: introY } : undefined}
              initial={animate ? { opacity: 0, x: -35 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: animate ? 0.9 : 0,
                delay: animate ? 0.35 : 0,
                ease,
              }}
            >
              <p className="handwriting">Xin chào, tôi là</p>
              <h1 className="display">
                ANH QUYỀN<span>.</span>
              </h1>
              <p className="hero-role">
                CAMERAMAN &<br />
                EDITOR · MEDIA
              </p>
              <p className="hero-description">
                Sinh viên Truyền thông & Tổ chức Sự kiện tại FPT Polytechnic TP.
                HCM. Chuyên quay dựng video, sáng tạo nội dung và ghi hình sự
                kiện.
              </p>
              <MagneticLink className="primary-link" href="#portfolio">
                Khám phá tác phẩm <ArrowDown size={18} />
              </MagneticLink>
              <span className="hero-location">
                <MapPin size={13} />
                TÂN THỚI HIỆP, TP. HỒ CHÍ MINH
              </span>
            </motion.div>
            <motion.div
              className="hero-side"
              initial={animate ? { opacity: 0, x: 30 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: animate ? 1 : 0,
                delay: animate ? 0.55 : 0,
                ease,
              }}
            >
              <div className="hero-manifesto">
                <span className="accent">✳</span>
                <p>
                  Mỗi khung hình.
                  <br />
                  Một góc nhìn mới.
                </p>
              </div>
              <div className="hero-stats">
                <div>
                  <span className="display">
                    8.0<span className="accent"> ★</span>
                  </span>
                  <p>
                    DỰ ÁN SỰ KIỆN HOA LỬA
                    <br />
                    FPT POLYTECHNIC TP. HCM
                  </p>
                </div>
                <div>
                  <span className="display">
                    REC<span className="accent"> ●</span>
                  </span>
                  <p>
                    QUAY DỰNG · CONTENT
                    <br />
                    TRUYỀN THÔNG SỰ KIỆN
                  </p>
                </div>
                <a href={profile.source} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> BỘ SƯU TẬP ẢNH
                </a>
              </div>
            </motion.div>
            <div className="hero-bottom">
              <button className="reel-button" onClick={() => open(projects[0])}>
                <span className="play-circle">
                  <ArrowUpRight />
                </span>
                <span>XEM DỰ ÁN</span>
                <span className="muted">MEDIA XDQH</span>
              </button>
              <span className="hero-scroll">
                CUỘN ĐỂ KHÁM PHÁ <ArrowDown size={14} />
              </span>
              <span className="edition">
                FPT POLYTECHNIC · SELECTED WORK 2024–2026
              </span>
            </div>
          </section>

          <section id="portfolio" className="section-wrap">
            <Reveal className="section-heading" variant="heading">
              <div>
                <span className="eyebrow">01 / SELECTED WORK</span>
                <h2 className="display">
                  CÂU CHUYỆN BẰNG HÌNH ẢNH<span className="accent">.</span>
                </h2>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setAll(!all);
                  setCategory("Tất cả");
                  setQuery("");
                }}
              >
                {all ? "TÁC PHẨM CHỌN LỌC" : "TẤT CẢ TÁC PHẨM"}
                <ArrowUpRight size={18} />
              </button>
            </Reveal>
            <Reveal
              className="portfolio-toolbar"
              variant="scale-up"
              delay={0.1}
            >
              <div
                className="filters"
                role="group"
                aria-label="Danh mục tác phẩm"
              >
                {categories.map((c) => (
                  <button
                    key={c}
                    className={c === category ? "selected" : ""}
                    aria-pressed={c === category}
                    onClick={() => {
                      setCategory(c);
                      setAll(true);
                    }}
                  >
                    {c}
                    {c === category && (
                      <motion.span
                        className="filter-line"
                        layoutId="filter-line"
                      />
                    )}
                  </button>
                ))}
              </div>
              <label className="portfolio-search">
                <Search size={15} />
                <input
                  type="search"
                  aria-label="Tìm tác phẩm"
                  placeholder="Tên hoặc danh mục…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setAll(true);
                  }}
                />
              </label>
            </Reveal>
            <motion.div className="project-grid" layout={animate}>
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <ProjectCard
                    key={`${p.category}-${p.title}-${p.image}`}
                    project={p}
                    index={i}
                    onOpen={open}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            {!shown.length && (
              <p className="trile-empty" role="status">
                Không tìm thấy tác phẩm. Hãy thử từ khóa khác.
              </p>
            )}
            <Reveal className="trile-disciplines" variant="scale-up">
              <span>GÓC NHÌN RIÊNG.</span>
              <strong>QUẢNG CÁO · EVENT · CONTENT · PHÓNG SỰ</strong>
              <span>CAMERAMAN / EDITOR / MEDIA</span>
            </Reveal>
          </section>

          <section id="expertise" className="section-wrap recognition">
            <Reveal className="recognition-intro" variant="slide-left">
              <span className="eyebrow">02 / CHUYÊN MÔN</span>
              <h2 className="display">
                TỪ KHUNG HÌNH.
                <br />
                <span className="accent">ĐẾN CÂU CHUYỆN.</span>
              </h2>
              <p>
                Kết hợp kỹ năng quay dựng, tư duy sáng tạo nội dung và kinh
                nghiệm vận hành sự kiện thực tế để tạo nên những sản phẩm truyền
                thông chỉn chu, giàu cảm xúc.
              </p>
            </Reveal>
            <div className="recognition-list">
              <ol>
                {services.map((service, i) => (
                  <Reveal
                    as="li"
                    className="recognition-row"
                    key={service.title}
                    variant="slide-right"
                    delay={i * 0.11}
                  >
                    <span className="award-index">0{i + 1}</span>
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          <section id="about" className="section-wrap about" ref={aboutRef}>
            <div className="about-lead">
              <Reveal variant="slide-left">
                <span className="eyebrow">03 / VỀ TÔI</span>
                <h2 className="display">
                  HUỲNH ANH QUYỀN<span className="accent">.</span>
                  <br />
                  NGƯỜI ĐỨNG SAU <span className="accent">ỐNG KÍNH.</span>
                </h2>
                <MagneticLink className="primary-link" href="#contact">
                  Trao đổi về dự án <ArrowUpRight size={18} />
                </MagneticLink>
              </Reveal>
              <Reveal as="p" variant="slide-right" delay={0.14}>
                {profile.about}
              </Reveal>
            </div>

            <div className="studio-grid">
              <Reveal className="education-panel" variant="slide-left">
                <h3 className="panel-heading">HỌC VẤN & NĂNG LỰC</h3>
                <p className="eyebrow accent">TRÌNH ĐỘ HỌC VẤN</p>
                {education.map((edu) => (
                  <div className="education-row" key={edu.school}>
                    <strong>{edu.school}</strong>
                    <span>{edu.period}</span>
                    <p>
                      {edu.major}
                      <br />
                      {edu.status}
                    </p>
                  </div>
                ))}
                <div className="education-row">
                  <strong>Định hướng Thực tập & Phát triển</strong>
                  <span>2025 – 2026</span>
                  <p>
                    {profile.subtitle} — {profile.targetCompany}
                  </p>
                </div>

                <p className="eyebrow accent skills-heading">
                  KỸ NĂNG CHUYÊN NGÀNH
                </p>
                <div className="skill-tags">
                  {hardSkills.map((skill, idx) => (
                    <motion.span
                      key={skill}
                      initial={
                        animate
                          ? { opacity: 0, scale: 0.78, y: 14 }
                          : false
                      }
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: animate ? 0.85 : 0,
                        delay: animate ? idx * 0.06 : 0,
                        ease,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                <p className="eyebrow accent skills-heading">
                  KỸ NĂNG MỀM & CÔNG CỤ
                </p>
                <div className="skill-tags">
                  {[...softSkills, ...tools].map((item, idx) => (
                    <motion.span
                      key={item}
                      initial={
                        animate
                          ? { opacity: 0, scale: 0.78, y: 14 }
                          : false
                      }
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: animate ? 0.85 : 0,
                        delay: animate ? idx * 0.05 : 0,
                        ease,
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </Reveal>

              <div className="process-panel">
                <Reveal variant="heading">
                  <h3 className="panel-heading">MỤC TIÊU NGHỀ NGHIỆP</h3>
                </Reveal>
                <div className="process-list">
                  <div className="process-track">
                    <motion.div
                      style={{ scaleY: animate ? aboutProgress : 1 }}
                    />
                  </div>
                  {careerGoals.map((goal, i) => (
                    <Reveal
                      className="process-row"
                      key={goal.num}
                      variant="scale-up"
                      delay={i * 0.12}
                    >
                      <span className="process-num display">{goal.num}</span>
                      <span className="process-node" />
                      <div>
                        <h4>
                          {goal.period} · {goal.title}
                        </h4>
                        <p>{goal.description}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <Reveal
                className="quote-panel"
                variant="quote-card"
                delay={0.18}
              >
                <span className="quote-mark display">“</span>
                <blockquote>
                  Từ ý tưởng nội dung
                  <br />
                  và góc máy hiện trường,
                  <br />
                  <em>
                    đến những thước phim
                    <br />
                    chạm tới cảm xúc.
                  </em>
                </blockquote>
                <span className="handwriting">Anh Quyền</span>
                <div className="quote-bottom">
                  NGÀY SINH: {profile.dob}
                  <br />
                  {profile.address.toUpperCase()}
                  <span className="quote-symbol" aria-hidden="true">
                    ✳
                  </span>
                </div>
              </Reveal>
            </div>
          </section>

          <section id="experience" className="journey section-wrap">
            <Reveal className="section-heading" variant="heading">
              <div>
                <span className="eyebrow">04 / KINH NGHIỆM & DỰ ÁN</span>
                <h2 className="display">
                  HÀNH TRÌNH THỰC CHIẾN<span className="accent">.</span>
                </h2>
              </div>
              <a className="text-link" href="#contact">
                KẾT NỐI HỢP TÁC <ArrowUpRight size={18} />
              </a>
            </Reveal>

            <div className="journey-grid">
              <div className="experience-list">
                {experiences.map((item, i) => (
                  <Reveal
                    key={item.title}
                    className={`experience-row ${openExp === i ? "is-open" : ""}`}
                    variant="slide-left"
                    delay={i * 0.11}
                  >
                    <button
                      aria-expanded={openExp === i}
                      aria-controls={`exp-${i}`}
                      onClick={() => setOpenExp(openExp === i ? null : i)}
                    >
                      <span className="experience-date">{item.date}</span>
                      <span>
                        <h3>{item.title}</h3>
                        <span className="experience-place">{item.place}</span>
                      </span>
                      {openExp === i ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    <AnimatePresence initial={false}>
                      {openExp === i && (
                        <motion.div
                          id={`exp-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: animate ? 0.55 : 0, ease }}
                        >
                          <p>{item.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                ))}
              </div>

              <Reveal
                className="awards-panel"
                variant="slide-right"
                delay={0.15}
              >
                <h3 className="display">
                  ĐIỂM NHẤN.
                  <br />
                  <span className="accent">NĂNG LƯỢNG TRẺ.</span>
                </h3>
                <div className="award-list">
                  {highlights.map((item, idx) => (
                    <motion.button
                      key={item.index}
                      type="button"
                      initial={
                        animate
                          ? { opacity: 0, x: 30, filter: "blur(4px)" }
                          : false
                      }
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                      }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: animate ? 1.0 : 0,
                        delay: animate ? idx * 0.1 : 0,
                        ease,
                      }}
                      onClick={() => {
                        document
                          .getElementById("portfolio")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span>{item.index}</span>
                      <span>
                        {item.title}
                        <small>{item.sub}</small>
                      </span>
                      <ArrowUpRight size={19} />
                    </motion.button>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          <ProcessComparison animate={animate} />

          <section id="backstage" className="section-wrap trile-feature">
            <Reveal variant="heading">
              <span className="eyebrow">06 / BEHIND THE SCENES</span>
              <div className="section-heading">
                <h2 className="display">
                  PHÍA SAU
                  <br />
                  <span className="accent">MỖI THƯỚC PHIM.</span>
                </h2>
                <a
                  className="text-link"
                  href={profile.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  TẤT CẢ ẢNH HẬU TRƯỜNG <ArrowUpRight />
                </a>
              </div>
            </Reveal>
            <div className="backstage-grid">
              {backstage.slice(0, 6).map((item, i) => (
                <BackstageCard
                  key={item.image}
                  item={item}
                  index={i}
                  onOpen={open}
                />
              ))}
            </div>
          </section>

          <section id="contact" className="section-wrap contact trile-contact">
            <div className="contact-grid">
              <Reveal className="contact-intro" variant="slide-left">
                <span className="eyebrow">07 / CÙNG KẾT NỐI</span>
                <h2 className="display">
                  CÙNG NHAU
                  <br />
                  <span className="accent">SÁNG TẠO.</span>
                </h2>
                <p>
                  Sẵn sàng tham gia các dự án quay dựng video, sáng tạo nội dung
                  Social Media và sản xuất truyền thông sự kiện tại TP. Hồ Chí
                  Minh.
                </p>
                <MagneticLink
                  className="contact-cta"
                  href={`mailto:${profile.email}`}
                >
                  GỬI LỜI NHẮN{" "}
                  <span className="round-arrow">
                    <ArrowUpRight />
                  </span>
                </MagneticLink>
              </Reveal>
              <Reveal
                className="contact-links"
                variant="scale-up"
                delay={0.16}
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail />
                  <span>
                    <small>THƯ ĐIỆN TỬ</small>
                    {profile.email}
                  </span>
                  <ArrowUpRight />
                </a>

                <a href={`tel:${profile.phone}`}>
                  <Phone />
                  <span>
                    <small>ĐIỆN THOẠI</small>
                    {profile.phoneDisplay}
                  </span>
                  <ArrowUpRight />
                </a>

                <div>
                  <MapPin />
                  <span>
                    <small>ĐỊA CHỈ · NGÀY SINH ({profile.dob})</small>
                    {profile.address}
                  </span>
                </div>
              </Reveal>
              <Reveal
                className="contact-video"
                variant="video-swing"
                delay={0.28}
              >
                <button
                  className="contact-video-card"
                  onClick={() => open(footerVideo)}
                  aria-label={"Phát video " + footerVideo.title}
                >
                  <span className="contact-video-top">
                    <span>ANH QUYỀN</span>
                    <span>WEDDING FILM</span>
                  </span>
                  <span className="contact-video-poster">
                    <img
                      src={footerVideo.image}
                      alt="Khung hình lễ tân hôn Viễn và Chính"
                      loading="lazy"
                      width={1600}
                      height={900}
                    />
                    <span className="contact-video-title">
                      LƯU GIỮ
                      <br />
                      <strong>KHOẢNH KHẮC.</strong>
                    </span>
                  </span>
                  <span className="contact-video-bottom">
                    <span>{footerVideo.title}</span>
                    <span className="contact-video-play">
                      <Play size={22} fill="currentColor" />
                    </span>
                  </span>
                </button>
                <a
                  className="contact-video-source"
                  href={footerVideo.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  XEM TRÊN GOOGLE DRIVE <ArrowUpRight size={13} />
                </a>
              </Reveal>
            </div>
          </section>
        </main>
        <footer className="footer trile-footer">
          <a href="#home" className="wordmark">
            ANH QUYỀN<span>©</span>
          </a>
          <span>
            © {new Date().getFullYear()} HUỲNH ANH QUYỀN · CAMERAMAN, EDITOR &
            MEDIA CONTENT.
          </span>
          <div className="trile-footer-links">
            <a href={profile.source} target="_blank" rel="noreferrer">
              <span>Google Drive</span>
              <ArrowUpRight size={16} />
            </a>

            <a href="#home" aria-label="Về đầu trang">
              <span>Đầu trang</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </footer>
        <AnimatePresence>
          {selected && (
            <ProjectDialog
              key={selected.title}
              project={selected}
              onClose={closeProject}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
    </AnimationContext.Provider>
  );
}
