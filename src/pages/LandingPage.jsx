import React, { useEffect, useState, useRef } from "react";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';


const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const featuresSectionRef = useRef(null);

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleLearnMore = () => {
    featuresSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Header Content */}
      <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollPosition * 0.5}px)`,
            transition: 'transform 0.1s linear'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
     

        {/* Hero content */}
        <div 
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
          style={{
            transform: `translateY(${scrollPosition * 0.2}px)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <Typography
            variant="h1"
            color="white"
            className="mb-4 text-4xl sm:text-5xl lg:text-6xl"
          >
            Selamat Datang di Nagari Intern
          </Typography>
          <Typography
            variant="lead"
            color="white"
            className="mb-8 opacity-80"
          >
            Website Pendaftaran Magang di Bank Nagari
          </Typography>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="gradient" color="blue" onClick={handleSignIn}>
              Mulai
            </Button>
            <Button size="lg" variant="text" color="white" onClick={handleLearnMore}>
              Pelajari Lebih Banyak
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresSectionRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl font-bold text-blue-gray-900 mb-4">
              Tentang Bank Nagari
            </Typography>
            <Typography variant="lead" className="text-blue-gray-600">
              Bank Pembangunan Daerah Sumatera Barat - Melayani dengan Sepenuh Hati
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="mt-6">
              <CardBody className="text-center">
                <div className="mb-4 w-14 h-14 rounded-full bg-blue-500/20 mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Sejarah Bank Nagari
                </Typography>
                <Typography className="text-blue-gray-600">
                  Berdiri sejak tahun 1962, Bank Nagari telah menjadi institusi keuangan terpercaya di Sumatera Barat dengan fokus pada pembangunan ekonomi daerah.
                </Typography>
              </CardBody>
            </Card>

            <Card className="mt-6">
              <CardBody className="text-center">
                <div className="mb-4 w-14 h-14 rounded-full bg-green-500/20 mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Program Magang
                </Typography>
                <Typography className="text-blue-gray-600">
                  Kesempatan magang yang memberikan pengalaman berharga dalam industri perbankan dengan bimbingan dari profesional berpengalaman.
                </Typography>
              </CardBody>
            </Card>

            <Card className="mt-6">
              <CardBody className="text-center">
                <div className="mb-4 w-14 h-14 rounded-full bg-purple-500/20 mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Product Bank Nagari
                </Typography>
                <Typography className="text-blue-gray-600">
                  Layanan perbankan yang lengkap dan inovatif untuk memenuhi kebutuhan nasabah perorangan maupun korporat.
                </Typography>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Featured Image Section with Parallax */}
      <footer className="bg-blue-400 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <Typography variant="h5" className="mb-6 font-semibold">
                Bank Nagari
              </Typography>
              <Typography className="text-white mb-4">
                Jl. Pemuda No. 21
                Padang, Sumatera Barat
                Indonesia 25117
              </Typography>
              <Typography className="text-white">
                Call Center: 1500-632
              </Typography>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <Typography variant="h6" className="mb-6 font-semibold">
                Quick Links
              </Typography>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Career
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Internship Program
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-span-1">
              <Typography variant="h6" className="mb-6 font-semibold">
                Services
              </Typography>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Personal Banking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Business Banking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Islamic Banking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-black transition-colors">
                    Digital Banking
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="col-span-1">
              <Typography variant="h6" className="mb-6 font-semibold">
                Connect With Us
              </Typography>
              <div className="flex space-x-4 mb-6">
                {/* Social Media Icons */}
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-sm text-white">
                © 2025 Bank Nagari. All rights reserved.
              </div>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6 text-sm text-white">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;