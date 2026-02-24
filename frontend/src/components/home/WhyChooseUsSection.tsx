import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";

const WhyChooseUsSection: React.FC = () => {
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/public/pages/home")
      .then((page) => {
        setSection(page?.sections?.whyChooseUs || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const bullets = section?.bullets?.length
    ? section.bullets
    : [
        {
          title: "Top Trusted Company",
          description:
            "With over 10 years of experience in residential, commercial, and industrial painting, we have successfully completed hundreds of projects with outstanding client satisfaction.",
        },
        {
          title: "High-Quality Workmanship",
          description:
            "We use advanced tools, proven techniques, and premium-grade paints to deliver smooth, durable, and flawless finishes on every project.",
        },
        {
          title: "Eco-Friendly Paint Solutions",
          description:
            "We prioritize environmentally responsible practices by using low-VOC, biodegradable, and eco-friendly paints that are safe for families, workplaces, and the environment.",
        },
      ];

  if (loading)
    return (
      <div className="py-20 bg-[#f2f2ee] text-center text-xl md:text-2xl">
        Loading...
      </div>
    );

  const headingText =
    section?.heading || "The Perfect Finish for Every Living Space";

  const words = headingText.split(" ");

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-[#f2f2ee] font-poppins overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="bg-[#0a4d44] rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] 
                        p-6 sm:p-10 lg:p-16 shadow-2xl">

          {/* ================= HEADING ================= */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14 sm:mb-20"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="text-[#a2ff86] text-lg sm:text-xl">✦</span>
              <span className="text-[#a2ff86] text-xs sm:text-sm tracking-[3px] uppercase font-semibold">
                {section?.eyebrow || "WHY CHOOSE US"}
              </span>
            </div>

            <h2
              className="text-white font-extrabold leading-[1.05] tracking-tight
                         text-[clamp(32px,6vw,110px)] flex flex-wrap gap-3"
            >
              {words.map((word: string, i: number) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        delay: i * 0.05,
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className={word === "Finish" ? "text-[#a2ff86]" : ""}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* ================= CONTENT GRID ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ===== IMAGE ===== */}
            <motion.div
              initial={{ opacity: 0, rotate: -6, scale: 0.9, y: 60 }}
              whileInView={{
                opacity: 1,
                rotate: 0,
                scale: 1,
                y: 0,
                transition: { duration: 0.8 },
              }}
              viewport={{ once: true }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              }}
              className="relative order-1 lg:order-none"
            >
              <img
                src={
                  section?.image ||
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
                }
                alt="Team"
                className="w-full h-[260px] sm:h-[340px] md:h-[420px] 
                           object-cover rounded-[25px] sm:rounded-[35px]"
              />

              <div className="absolute -bottom-1 -right-1 
                              w-16 h-16 sm:w-24 sm:h-24 
                              bg-[#0a4d44] rounded-tl-[40px] sm:rounded-tl-[60px]" />
            </motion.div>

            {/* ===== BULLETS ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="flex flex-col gap-8 sm:gap-12"
            >
              {bullets.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: 60 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                  className="flex items-start gap-4 sm:gap-6"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full 
                                  bg-[#a2ff86] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0a4d44] text-lg sm:text-2xl font-bold">
                      {idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed max-w-[500px]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center
                             bg-[#a2ff86] text-[#0a4d44] font-bold
                             px-6 sm:px-10 py-3 sm:py-5
                             text-sm sm:text-lg
                             rounded-full
                             hover:bg-white
                             transition-all duration-300"
                >
                  Get Started Now
                  <ArrowRight size={20} className="ml-3 sm:ml-4" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;