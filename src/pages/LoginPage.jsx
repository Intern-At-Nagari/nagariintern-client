import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input, Button, Typography } from "@material-tailwind/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail, validatePassword } from "../utils/validation";
import axios from "axios";
import AnimatedButton from "../components/AnimatedButton";
import { useAuth } from "../utils/AuthContext";
import { loginUser } from "../apiService";

const LoginForm = ({ nagariImage, onToggleForm }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = `Password must include: ${passwordErrors.join(", ")}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData);

      login(response.data);
      if (response.data.user.role != "User") {
        toast.error("Login failed. Please check your credentials.");
      } else {
        toast.success("Login successful!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", );
      if (error.response && error.response.status === 401) {
        setErrors({ submit: error.response.data.error });
        toast.error(error.response.data.error);
      } else {
        setErrors({ submit: error.response?.data?.message || "Login failed" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const imageVariants = {
    animate: { x: "0%", opacity: 1 },
    exit: { x: "-100%", opacity: 1 },
  };

  const formVariants = {
    initial: { x: "-100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  const transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  };


  return (
    <>
      {/* Image Section */}
      <motion.div
        className="absolute w-1/2 md:w-1/2 h-full hidden md:block"
        style={{ left: "50%" }}
        variants={imageVariants}
        initial="initial" 
        animate="animate"
        exit="exit"
        transition={transition}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600">
          <img
            src={nagariImage}
            alt="Auth"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Mobile Background Image */}
      <div className="absolute inset-0 md:hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-400/90 to-blue-600/90">
          <img
            src={nagariImage}
            alt="Auth"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      </div>

      {/* Form Section */}
      <motion.div
        className="absolute w-full md:w-1/2 h-full flex items-center justify-center p-4 md:p-6"
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 md:space-y-6 bg-white/80 md:bg-transparent p-6 rounded-lg backdrop-blur-sm md:backdrop-blur-none">
          <div className="text-center">
            <Typography variant="h4" color="blue" className="text-2xl md:text-3xl font-bold">
              Masuk
            </Typography>
          </div>

          {errors.submit && (
            <Typography variant="small" color="red" className="mb-4">
              {errors.submit}
            </Typography>
          )}

          <div className="space-y-3 md:space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                label="Email"
                icon={<EnvelopeIcon className="h-5 w-5" />}
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                required
                className="!bg-white"
              />
              {errors.email && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.email}
                </Typography>
              )}
            </div>

            <div>
              <Input
                type="password"
                name="password"
                label="Password"
                icon={<LockClosedIcon className="h-5 w-5" />}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                required
                className="!bg-white"
              />
              {errors.password && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.password}
                </Typography>
              )}
            </div>

            <AnimatedButton
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              MASUK
            </AnimatedButton>
          </div>

          <Typography variant="small" className="text-center mt-4">
            <a href="#" className="text-blue-500 hover:underline">
              Lupa Password?
            </a>
          </Typography>

          <Typography variant="small" className="text-center mt-4">
            Tidak Punya Akun?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onToggleForm();
              }}
              className="font-medium text-blue-500 hover:underline"
            >
              Daftar
            </a>
          </Typography>

          <Typography variant="small" className="text-center mt-2">
            <a
              href="#"
              onClick={() => navigate("/")}
              className="text-blue-500 hover:underline"
            >
              Back to Home
            </a>
          </Typography>
        </form>
      </motion.div>
    </>
  );
};

export default LoginForm;