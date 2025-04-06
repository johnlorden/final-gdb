
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DonateFooter from '@/components/DonateFooter';
import { useTheme } from 'next-themes';
import { Clock, Code, Globe, Heart, Lightbulb, Users } from 'lucide-react';
import LanguageService from '@/services/LanguageService';
import { BibleLanguage } from '@/types/LanguageTypes';

const About = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [languages, setLanguages] = React.useState<BibleLanguage[]>([]);
  const [activeTab, setActiveTab] = React.useState('about');
  
  React.useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const allLanguages = await LanguageService.getAllLanguages();
        setLanguages(allLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    
    fetchLanguages();
  }, []);
  
  const features = [
    {
      title: "Daily Bible Verses",
      description: "Access a curated collection of Bible verses organized by categories.",
      icon: <Clock className="h-6 w-6 text-indigo-500" />
    },
    {
      title: "Multiple Languages",
      description: `Available in ${languages.filter(l => l.is_active).length} languages with easy language switching.`,
      icon: <Globe className="h-6 w-6 text-green-500" />
    },
    {
      title: "Social Sharing",
      description: "Share verses with friends and family across multiple platforms.",
      icon: <Users className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Offline Access",
      description: "Access verses even without an internet connection.",
      icon: <Code className="h-6 w-6 text-yellow-500" />
    },
    {
      title: "Customizable Visuals",
      description: "Personalize verse cards with different styles and backgrounds.",
      icon: <Lightbulb className="h-6 w-6 text-pink-500" />
    },
    {
      title: "Searchable Content",
      description: "Find verses by reference, category, or content.",
      icon: <Heart className="h-6 w-6 text-red-500" />
    }
  ];
  
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <Header />
      
      <main className="py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">About Daily Bible Verses</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="about">Our Mission</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>The purpose behind Daily Bible Verses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Daily Bible Verses was created with a simple mission: to make the wisdom and comfort of scripture 
                  accessible to everyone, everywhere, at any time.
                </p>
                <p>
                  In today's fast-paced world, finding moments of reflection and spiritual growth can be challenging. 
                  Our app aims to bring the timeless wisdom of the Bible into your daily life in a seamless, 
                  user-friendly way.
                </p>
                <p>
                  Whether you're seeking guidance, comfort, inspiration, or simply want to deepen your faith journey, 
                  we've designed this platform to be your companion along the way.
                </p>
                <p className="font-medium italic border-l-4 border-indigo-500 pl-4 py-2">
                  "Your word is a lamp for my feet, a light on my path." — Psalm 119:105
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
                <CardDescription>How Daily Bible Verses came to be</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Daily Bible Verses began as a personal project born from a desire to make scripture more 
                  accessible in our everyday lives. What started as a simple collection of favorite verses 
                  has evolved into a comprehensive platform serving people around the world.
                </p>
                <p>
                  The development team consists of passionate individuals who believe in the power of scripture 
                  to transform lives. Each feature has been carefully designed with the user in mind, ensuring 
                  that the wisdom of the Bible is just a click away.
                </p>
                <p>
                  As we continue to grow, our commitment remains the same: to provide a thoughtful, accessible 
                  way for people to engage with biblical wisdom in their daily lives.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Languages</CardTitle>
                <CardDescription>Bible verses in your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {languages.map((language) => (
                    <div 
                      key={language.language_code}
                      className={`p-3 rounded-md text-center ${
                        language.is_active 
                          ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-900' 
                          : 'bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-500'
                      }`}
                    >
                      <p className="font-medium">{language.language_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {language.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  ))}
                </div>
                
                {languages.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Loading language information...
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="partners" className="space-y-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Our Partners</CardTitle>
                <CardDescription>Organizations that help make Daily Bible Verses possible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="italic">
                  We're grateful to work with partners who share our mission of making scripture accessible to all.
                </p>
                
                <div className="flex flex-wrap gap-8 justify-center items-center py-6">
                  {/* Placeholder for partner logos - can be replaced with actual partner logos later */}
                  <div className="w-32 h-16 bg-muted rounded flex items-center justify-center">Partner 1</div>
                  <div className="w-32 h-16 bg-muted rounded flex items-center justify-center">Partner 2</div>
                  <div className="w-32 h-16 bg-muted rounded flex items-center justify-center">Partner 3</div>
                </div>
                
                <p>
                  Interested in partnering with us? Reach out to learn more about collaboration opportunities
                  that help spread biblical wisdom to more people around the world.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Partners listed here are for demonstration purposes only.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <DonateFooter />
    </div>
  );
};

export default About;
