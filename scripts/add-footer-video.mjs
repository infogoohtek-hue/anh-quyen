import fs from 'node:fs';
const p='src/components/Portfolio.jsx';let s=fs.readFileSync(p,'utf8');s=s.replace('import ProcessComparison from "./ProcessComparison";','import ProcessComparison from "./ProcessComparison";\nimport { footerVideo } from "../data/footer-video";');
const marker='            </div>\n          </section>\n        </main>';
s=s.replace(/            <\/div>\s*<\/section>\s*<\/main>/,`              <Reveal className="contact-video" delay={0.15}>
                <button className="contact-video-card" onClick={() => open(footerVideo)} aria-label={"Phát video " + footerVideo.title}>
                  <span className="contact-video-top"><span>ANH QUYỀN</span><span>WEDDING FILM</span></span>
                  <span className="contact-video-poster"><img src={footerVideo.image} alt="Khung hình lễ tân hôn Viễn và Chính" loading="lazy" width={1600} height={900}/><span className="contact-video-title">LƯU GIỮ<br/><strong>KHOẢNH KHẮC.</strong></span></span>
                  <span className="contact-video-bottom"><span>{footerVideo.title}</span><span className="contact-video-play"><Play size={22} fill="currentColor"/></span></span>
                </button>
                <a className="contact-video-source" href={footerVideo.source} target="_blank" rel="noreferrer">XEM TRÊN GOOGLE DRIVE <ArrowUpRight size={13}/></a>
              </Reveal>
            </div>
          </section>
        </main>`);
fs.writeFileSync(p,s);

