import fs from "node:fs/promises";
const folders = [
  ["backstage", "1L1bEv8ruLL4iv1RDIBe6BIja309Qn32L"],
  ["final", process.env.FINAL_FOLDER_ID || "1vhRfobKLM5lnYjo47vYs8PEW0I1DAO02"],
];
let manifest = JSON.parse(await fs.readFile("src/data/media.json", "utf8"));
for (const [group, id] of folders) {
  const response = await fetch("https://drive.google.com/drive/folders/" + id);
  const html = await response.text();
  const raw = html.match(/_DRIVE_ivd'\] = '((?:\\.|[^'])*)'/)?.[1];
  if (!raw) throw new Error("Cannot read folder " + id);
  const decoded = raw
    .replace(/\\x([0-9a-f]{2})/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    )
    .replace(/\\\//g, "/")
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
  const rows = JSON.parse(decoded)[0] || [];
  await fs.mkdir("public/images/" + group, { recursive: true });
  for (const row of rows
    .filter((r) => r[3]?.startsWith("image/"))
    .slice(0, 18)) {
    const r = await fetch(
      "https://drive.google.com/thumbnail?id=" + row[0] + "&sz=w1600",
    );
    if (!r.ok || !r.headers.get("content-type")?.startsWith("image/"))
      throw new Error("Cannot download " + row[0]);
    const image = "/images/" + group + "/" + row[0] + ".jpg";
    await fs.writeFile("public" + image, Buffer.from(await r.arrayBuffer()));
    manifest = manifest.filter((m) => m.id !== row[0]);
    manifest.push({
      group,
      id: row[0],
      name: row[2],
      image,
      source: "https://drive.google.com/file/d/" + row[0] + "/view",
    });
  }
}
await fs.writeFile("src/data/media.json", JSON.stringify(manifest, null, 2));
console.log("Saved", manifest.length, "media entries");
