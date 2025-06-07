import {
  ArrowRight,
  Database,
  FileText,
  LineChart,
  Shield,
} from "lucide-react";
import { FaBrain, FaCog, FaMicrochip, FaRobot } from "react-icons/fa";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home");
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const robotVariants: Variants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  const cogVariants: Variants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="relative inline-block mb-8"
          >
            <motion.div
              variants={robotVariants}
              initial="initial"
              animate="animate"
              className="text-8xl mb-4"
            >
              <FaRobot className="mx-auto text-blue-400" />
            </motion.div>
            <motion.div
              variants={cogVariants}
              initial="initial"
              animate="animate"
              className="absolute -top-4 -right-4 text-4xl text-purple-400"
            >
              <FaCog />
            </motion.div>
            <motion.div
              variants={cogVariants}
              initial="initial"
              animate="animate"
              className="absolute -bottom-4 -left-4 text-4xl text-pink-400"
            >
              <FaCog />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Are you ready to structure your data?
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Experience the future of medical data processing with our advanced
            AI-powered platform
          </motion.p>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group"
          >
            <span>Start Structuring Now</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="group-hover:translate-x-1 transition-transform"
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {[
            {
              icon: <FaRobot className="text-4xl text-blue-400" />,
              title: "Smart Processing",
              description:
                "Advanced AI algorithms for accurate data extraction",
            },
            {
              icon: <FaMicrochip className="text-4xl text-purple-400" />,
              title: "Document Analysis",
              description: "Intelligent parsing of medical documents",
            },
            {
              icon: <FaBrain className="text-4xl text-pink-400" />,
              title: "Real-time Analytics",
              description: "Instant insights and data visualization",
            },
            {
              icon: <FaCog className="text-4xl text-indigo-400" />,
              title: "Security & Compliance",
              description: "HIPAA-compliant data handling",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { value: "98%", label: "Accuracy Rate" },
            { value: "10k+", label: "Documents Processed" },
            { value: "24/7", label: "Availability" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="text-4xl font-bold text-blue-400 mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold mb-4 text-blue-300">
              Ready to Transform Your Data?
            </h2>
            <p className="text-gray-300 mb-6">
              Join thousands of healthcare providers who trust our platform
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
