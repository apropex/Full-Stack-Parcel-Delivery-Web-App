import img6 from "@/assets/images/a1.jpg";
import img2 from "@/assets/images/a3.jpeg";
import img5 from "@/assets/images/a5.jpg";
import img7 from "@/assets/images/a6.jpg";
import img3 from "@/assets/images/a8.jpg";
import img4 from "@/assets/images/login-img.jpg";
import img1 from "@/assets/images/reg-img.jpg";
import PageContainer from "@/components/layouts/PageContainer";
import { motion } from "motion/react";

export default function About() {
  return (
    <PageContainer>
      <div className="grid lg:grid-cols-2 gap-x-3">
        {/* Left side section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl font-semibold">Our Story</h2>
            <p className="font-semibold mt-4">
              Quickly communicate maintainable potentialities for magnetic
              infrastructures. Rapidiously matrix leveraged core competencies and
              compelling testing procedures. Appropriately actualize effective outsourcing
              after interoperable bandwidth.
            </p>
            <p className="text-muted-foreground mt-4">
              Competently benchmark enterprise-wide applications and progressive
              potentialities. Energistically benchmark adaptive models with team driven
              models. Conveniently extend frictionless meta-services vis-a-vis
              economically sound infomediaries.
            </p>
          </div>

          {/* Left side images */}
          <div className="grid grid-cols-2 mt-24 gap-x-3">
            <motion.div
              className="flex items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img src={img1} alt="" className="rounded-xl w-full" />
            </motion.div>

            <motion.div
              className="flex flex-col justify-center gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img src={img2} alt="" className="rounded-xl w-full" />
              <img src={img3} alt="" className="rounded-xl w-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right side section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Right side images */}
          <div className="flex flex-row-reverse lg:flex-row lg:mt-24 gap-x-3">
            <motion.div
              className="flex-1 flex items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img src={img4} alt="" className="rounded-xl w-full" />
            </motion.div>

            <motion.div
              className="flex-1 flex flex-col justify-center gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img src={img5} alt="" className="rounded-xl w-full" />
              <img src={img6} alt="" className="rounded-xl w-full" />
              <img src={img7} alt="" className="rounded-xl w-full" />
            </motion.div>
          </div>

          {/* Right side content */}
          <div className="mt-14">
            <h2 className="text-2xl font-semibold">Our Work Place</h2>
            <p className="font-semibold mt-4">
              Quickly communicate maintainable potentialities for magnetic
              infrastructures. Rapidiously matrix leveraged core competencies and
              compelling testing procedures. Appropriately actualize effective outsourcing
              after interoperable bandwidth.
            </p>
            <p className="text-muted-foreground mt-4">
              Competently benchmark enterprise-wide applications and progressive
              potentialities. Energistically benchmark adaptive models with team driven
              models. Conveniently extend frictionless meta-services vis-a-vis
              economically sound infomediaries.
            </p>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
