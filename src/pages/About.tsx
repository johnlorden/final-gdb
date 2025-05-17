
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, User, Info, Heart, Book, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PartnersComponent from '@/components/Partners';

const MotionCard = motion(Card);

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  return (
    <div className="container mx-auto px-4 py-8 mb-10">
      <motion.div 
        className="prose dark:prose-invert mx-auto max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">About God's Daily Bread</h1>
        
        {/* Hero Section */}
        <motion.section 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg mb-4">
            <span className="text-primary font-semibold">God's Daily Bread</span> is dedicated to bringing the wisdom and comfort of scripture to people around the world.
          </p>
          <p className="text-muted-foreground">
            "Your word is a lamp to my feet and a light to my path." — Psalm 119:105
          </p>
        </motion.section>
        
        {/* Profile Section */}
        <motion.section 
          className="mb-12"
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Meet the Creator
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-muted/30 rounded-xl p-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar className="h-32 w-32 border-2 border-primary">
                <AvatarImage src="https://i.pravatar.cc/300" alt="John Lorden E." />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">John Lorden E.</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">Developer</Badge>
                <Badge variant="outline">Student</Badge>
                <Badge variant="outline">Christian</Badge>
              </div>
              <p className="mb-4">
                Lorden created God's Daily Bread with a mission to share the power of scripture with people seeking guidance, 
                hope, and strength. His passion for technology and faith came together in this project to make the Word of God 
                accessible to everyone, everywhere.
              </p>
              <p className="text-muted-foreground">
                "I built this application to help those who need spiritual guidance and hope through the power of God's Word. 
                Each verse can be a beacon of light during dark times, a source of wisdom during confusion, 
                and a wellspring of strength when we feel weak."
              </p>
              <div className="mt-4">
                <a 
                  href="https://www.johnlorden.online" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Visit my website <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <MotionCard 
            className="overflow-hidden"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-primary">
                <Heart className="h-5 w-5" /> Our Mission
              </h2>
              <p className="mb-4">
                God's Daily Bread is dedicated to bringing the wisdom and comfort of scripture to people around the world.
                We believe that daily engagement with Bible verses can provide guidance, inspiration, and spiritual nourishment.
              </p>
              <motion.div 
                className="w-16 h-1 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </CardContent>
          </MotionCard>
          
          <MotionCard 
            className="overflow-hidden"
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeIn}
          >
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-primary">
                <Globe className="h-5 w-5" /> Our Vision
              </h2>
              <p className="mb-4">
                We envision a world where everyone can easily access and reflect on God's word every day,
                regardless of language barriers or internet limitations. Our goal is to make Bible verses accessible,
                shareable, and meaningful for daily life.
              </p>
              <motion.div 
                className="w-16 h-1 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              />
            </CardContent>
          </MotionCard>
        </div>
        
        {/* Features Section */}
        <motion.section 
          className="mb-12"
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" /> Features
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Daily Bible verses from various categories",
              "Mobile-friendly interface with swipe navigation",
              "Multiple language support",
              "Offline mode for access without internet",
              "Share verses on social media",
              "Bookmark your favorite verses",
              "Customizable verse displays",
              "Dark and light mode support",
              "Download Verses as Images",
              "Generate QR Codes for Verses"
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card p-4 rounded-lg border flex items-start gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                <div className="rounded-full bg-primary/10 p-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Partners Section */}
        <motion.section 
          className="mb-12"
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" /> Our Partners
          </h2>
          <p className="text-center mb-8 text-muted-foreground">
            We're grateful for the support of these amazing organizations who help us bring God's word to people around the world.
          </p>
          
          <div className="bg-muted/30 p-6 rounded-xl">
            <PartnersComponent />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-muted-foreground text-sm">
              Special thanks to <span className="font-semibold">Every Nation Campus</span> and my <span classname="font-semibold">Victory Group</span> for their continued support and guidance.
            </p>
          </div>
        </motion.section>
        
        {/* Contact Section */}
        <motion.section 
          className="mb-8 text-center"
          initial="hidden"
          animate="visible"
          custom={7}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-6">
            Have questions, feedback, or suggestions? We'd love to hear from you!
            Please reach out to us at <a href="mailto:hello@johnlorden.online" className="text-primary hover:underline">hello@johnlorden.online</a>.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4" viewBox="0 0 16 16">
                <path d="M16 8.05A8 8 0 1 1 0 8.05 8 8 0 0 1 16 8.05zM8 3.368v.001a4.682 4.682 0 0 0-4.682 4.682c0 2.585 2.096 4.681 4.682 4.681 2.586 0 4.682-2.096 4.682-4.681C12.682 5.465 10.586 3.368 8 3.368zm1.414 7.03a.485.485 0 0 1-.686 0L6.294 7.965a.483.483 0 0 1-.142-.343v-2.29a.484.484 0 0 1 .969 0v2.09l2.293 2.294a.484.484 0 0 1 0 .686z"/>
              </svg>
              Share Feedback
            </Button>
            <a 
              href="https://www.bible.com" 
              target="_blank" 
              rel="noopener noreferrer" 
            >
              <Button className="flex items-center gap-2">
                Visit YouVersion Bible <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;
