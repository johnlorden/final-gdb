
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Partners from '@/components/Partners';

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose dark:prose-invert mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">About God's Daily Bread</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              God's Daily Bread is dedicated to bringing the wisdom and comfort of scripture to people around the world.
              We believe that daily engagement with Bible verses can provide guidance, inspiration, and spiritual nourishment.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p>
              We envision a world where everyone can easily access and reflect on God's word every day,
              regardless of language barriers or internet limitations. Our goal is to make Bible verses accessible,
              shareable, and meaningful for daily life.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-6">
              <li>Daily Bible verses from various categories</li>
              <li>Mobile-friendly interface with swipe navigation</li>
              <li>Multiple language support</li>
              <li>Offline mode for access without internet</li>
              <li>Share verses on social media</li>
              <li>Bookmark your favorite verses</li>
              <li>Customizable verse displays</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Partners</h2>
            <Partners />
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              Have questions, feedback, or suggestions? We'd love to hear from you!
              Please reach out to us at <a href="mailto:contact@godsdailybread.org" className="text-primary hover:underline">contact@godsdailybread.org</a>.
            </p>
          </section>
          
          <div className="text-center mt-10">
            <a 
              href="https://www.bible.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-primary hover:underline"
            >
              Visit YouVersion Bible <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
