import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Avatar,
  Alert,
} from "@material-tailwind/react";
import profileImg from '../assets/profile.png';

import { UserIcon, KeyIcon, EnvelopeIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [formData, setFormData] = useState({
    nama: userData.nama || "",
    email: userData.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your API call here to update profile
      // Example:
      // await axios.put('/api/users/profile', formData);
      const updatedUser = { ...userData, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }
    try {
      // Add your API call here to update password
      // Example:
      // await axios.put('/api/users/password', passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleResendVerification = async () => {
    try {
      // Add your API call here to resend verification email
      // Example:
      // await axios.post('/api/users/resend-verification');
      alert('Email verifikasi telah dikirim ulang');
    } catch (error) {
      console.error('Error resending verification:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="w-full">
        <CardHeader floated={false} className="h-48">
          <div className="bg-blue-500 w-full h-full" />
        </CardHeader>
        <CardBody className="relative -mt-20 px-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar
              size="xxl"
              variant="circular"
              alt="Profile Picture"
              className="border-4 border-white"
              src={profileImg}
            />
            <Typography variant="h4" color="blue-gray" className="mt-4">
              {userData.nama || 'Nama Pengguna'}
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              {userData.role === 'admin' ? 'Administrator' : 'Pengguna'}
            </Typography>
            
          </div>

          <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
            <TabsHeader>
              <Tab value="profile" className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profil
              </Tab>
              <Tab value="password" className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5" />
                Password
              </Tab>
            </TabsHeader>
            <TabsBody animate={{
              initial: { y: 10, opacity: 0 },
              mount: { y: 0, opacity: 1 },
              unmount: { y: 10, opacity: 0 },
            }}>
              <TabPanel value="profile">
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      size="lg"
                      label="Nama Lengkap"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <Input
                      size="lg"
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                    />
                  </div>
                  <div className="flex justify-end mt-6 gap-4">
                    {isEditing ? (
                      <>
                        <Button
                          variant="text"
                          color="red"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              nama: userData.nama || "",
                              email: userData.email || "",
                            });
                          }}
                        >
                          Batal
                        </Button>
                        <Button color="blue" type="submit">
                          Simpan
                        </Button>
                      </>
                    ) : (
                      <Button color="blue" onClick={() => setIsEditing(true)}>
                        Edit Profil
                      </Button>
                    )}
                  </div>
                </form>
              </TabPanel>

              <TabPanel value="password">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    <Input
                      type="password"
                      size="lg"
                      label="Password Saat Ini"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <Input
                      type="password"
                      size="lg"
                      label="Password Baru"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <Input
                      type="password"
                      size="lg"
                      label="Konfirmasi Password Baru"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button color="blue" type="submit">
                      Ubah Password
                    </Button>
                  </div>
                </form>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;