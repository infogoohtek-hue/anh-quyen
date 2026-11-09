import media from "./media.json";
export const profile = {
  name: "Huỳnh Anh Quyền",
  role: "Cameraman & Editor",
  email: "anhquyen18926@gmail.com",
  phone: "0363583613",
  avatar: "/images/avatar-new-cutout.png",
  source:
    "https://drive.google.com/drive/folders/1L1bEv8ruLL4iv1RDIBe6BIja309Qn32L",
  about:
    "Tôi là Huỳnh Anh Quyền — cameraman và editor. Tôi thực hiện quay phim, dựng phim cho quảng cáo, event, TVC, phóng sự và chụp ảnh sự kiện. Portfolio này tập hợp hình ảnh sản phẩm cùng những khoảnh khắc trong quá trình làm việc.",
};
export const services = [
  {
    title: "Quảng cáo & TVC",
    description: "Hình ảnh truyền tải câu chuyện thương hiệu.",
  },
  {
    title: "Quay phim sự kiện",
    description: "Ghi lại không khí và những khoảnh khắc của sự kiện.",
  },
  {
    title: "Phóng sự",
    description: "Theo sát câu chuyện, nhân vật và diễn biến thực tế.",
  },
  {
    title: "Dựng phim",
    description: "Kết nối hình ảnh thành câu chuyện có nhịp điệu.",
  },
  {
    title: "Chụp ảnh event",
    description: "Lưu giữ khoảnh khắc bằng những khung hình.",
  },
];
const labels = {
  backstage: "Hậu trường",
  final: "Ảnh FINAL",
  media: "Media XDQH",
};
export const projects = media.map((item, index) => ({
  ...item,
  title:
    item.type === "video"
      ? item.name
      : labels[item.group] +
        " — " +
        String(
          media.filter((m) => m.group === item.group).indexOf(item) + 1,
        ).padStart(2, "0"),
  category: labels[item.group],
  role: profile.role,
  description:
    item.group === "backstage"
      ? "Hình ảnh trong quá trình làm việc của Huỳnh Anh Quyền."
      : "Hình ảnh từ bộ sưu tập " + labels[item.group] + ".",
  gallery: [
    {
      image: item.image,
      caption:
        item.group === "backstage"
          ? "Khoảnh khắc tại hiện trường"
          : labels[item.group],
    },
  ],
}));
export const backstage = projects.filter((p) => p.group === "backstage");
export const featuredProjects = [
  ...projects.filter((p) => p.group !== "backstage").slice(0, 4),
  ...backstage.slice(0, 2),
];
export const categories = [
  "Tất cả",
  ...new Set(
    projects
      .filter((p) => p.category !== labels.media)
      .map((p) => p.category),
  ),
  labels.media,
];
