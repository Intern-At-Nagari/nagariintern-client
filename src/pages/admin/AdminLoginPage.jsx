import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../utils/validation";
import { useAuth } from "../../utils/AuthContext";
import { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AdminLoginForm = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    setUserData(user);
    if (user && user.role === "Admin") {
      navigate("/admin/peserta-magang");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "email is required";
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = `Password must include: ${passwordErrors.join(
        ", "
      )}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        formData
      );


      console.log(response.data);

      loginAdmin(response.data);
      if (response.data.user.role != "Admin") {
        toast.error("Login failed. Please check your credentials.");
      } else {
        toast.success("Login successful!");
        if (response.data.user.lengkap == false) {
          navigate("/admin/firstlogin");
        } else
        navigate("/admin/peserta-magang");
      }
      
    } catch (error) {
      console.error("Error during admin login:", error);
      setErrors({ submit: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader color="blue" className="text-center py-4">
          <Typography variant="h5" color="white">
            Admin Login
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <Typography color="red" className="text-center text-sm">
                {errors.submit}
              </Typography>
            )}

            <div className="space-y-4">
              <Input
                label="email"
                name="email"
                icon={<UserIcon className="h-5 w-5" />}
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
              />
              {errors.email && (
                <Typography color="red" className="text-sm">
                  {errors.email}
                </Typography>
              )}

              <Input
                label="Password"
                type="password"
                name="password"
                icon={<LockClosedIcon className="h-5 w-5" />}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
              />
              {errors.password && (
                <Typography color="red" className="text-sm">
                  {errors.password}
                </Typography>
              )}
            </div>

            <Button type="submit" color="blue" fullWidth disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Login"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
