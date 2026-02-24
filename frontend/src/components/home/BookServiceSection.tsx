import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";

const BookServiceSection: React.FC = () => {
  const points = [
    "Eco-Friendly Painting",
    "Precise and Spotless Finish",
    "Tailored Residential & Commercial Service",
    "Premium Quality Materials",
  ];

  // Animation variants (staggered fade + slide)
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section id="book-service" className="py-24 bg-[#f2f2ee] overflow-hidden">
      <div className="page-container grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-center">

        {/* Left Image */}
        <motion.div
          className="relative min-h-[540px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeInUp as any}
        >
          <img
            src="/images/image.png" // Replace with your painting image in public folder
            alt="Professional Painting Service"
            className="w-[88%] h-[520px] object-cover rounded-[30px] border border-[#dce1e6]"
          />
          <img
            src="/images/image2.png" // Replace with secondary image
            alt="Painting Tools"
            className="absolute -bottom-10 right-0 w-[58%] h-[290px] object-cover rounded-[24px] border-[6px] border-[#f2f2ee] shadow-xl"
          />
        </motion.div>

        {/* Right Text */}
        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Subtitle */}
          <motion.p
            className="text-[#5a6773] text-sm font-semibold uppercase tracking-widest mb-3"
            custom={1}
            variants={fadeInUp as any}
          >
            About Cleaning Agency
          </motion.p>

          {/* Main Heading */}
          <motion.h2
            className="text-[#1f2c3c] text-3xl sm:text-4xl md:text-3xl lg:text-3xl font-bold leading-snug md:leading-tight mb-6"
            custom={2}
            variants={fadeInUp as any}
          >
            We offer a wide range of{" "}
            <span className="text-[#00A859]">professional painting services</span>{" "}
            tailored to residential{" "}
            <span className="text-[#00A859]">commercial and</span> specialized projects
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-[#5e6975] text-base md:text-lg leading-relaxed mb-6 max-w-[620px]"
            custom={3}
            variants={fadeInUp as any}
          >
            We are committed to delivering exceptional painting solutions that
            transform your spaces with precision and lasting beauty. Our
            experienced team uses premium, eco-friendly paints to ensure a safe,
            durable, and flawless finish every time.
          </motion.p>

          {/* Key Points */}
          <div className="space-y-3 mb-8">
            {points.map((item, i) => (
              <motion.p
                key={item}
                className="inline-flex items-center gap-3 text-[#1f2c3c] text-lg font-semibold w-full"
                custom={i + 4}
                variants={fadeInUp as any}
              >
                <CheckCircle2 className="w-5 h-5 text-[#00A859]" />
                {item}
              </motion.p>
            ))}
          </div>

          {/* Call-to-Action Button */}
          <motion.div custom={points.length + 4} variants={fadeInUp as any}>
            <Link
              to="/book-service"
              className="inline-flex items-center gap-3 bg-[#1f2c3c] hover:bg-[#00A859] text-white h-[60px] sm:h-[64px] rounded-full px-8 text-base sm:text-lg font-semibold transition-colors"
            >
              Book A Service
              <span className="w-9 h-9 rounded-full bg-[#00A859] grid place-items-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookServiceSection;