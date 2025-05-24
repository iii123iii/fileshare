import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Upload,
  Monitor,
  Share2,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Cross Platform",
    description: "Access your files from any device, anywhere in the world",
    icon: Monitor,
  },
  {
    title: "Easy Sharing",
    description: "Share files with anyone through a simple link",
    icon: Share2,
  },
  {
    title: "File Management",
    description: "Organize and manage your files with a simple interface",
    icon: FolderKanban,
  },
];

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative px-4 py-8 md:py-12">
      <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 md:top-[-4rem] ml-[-19rem] md:ml-[-38rem] h-[calc(100%)] md:h-[calc(100%+4rem)] w-[40rem] md:w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary/30 dark:to-primary/20">
            <svg
              aria-hidden="true"
              className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-muted stroke-border/5"
            >
              <defs>
                <pattern
                  id="pattern"
                  width="72"
                  height="56"
                  patternUnits="userSpaceOnUse"
                  x="50%"
                  y="0"
                >
                  <path d="M.5 56V.5H72" fill="none" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill="url(#pattern)"
              />
              <svg x="50%" y="0" className="overflow-visible">
                <rect strokeWidth="0" width="73" height="57" x="0" y="0" />
                <rect strokeWidth="0" width="73" height="57" x="72" y="0" />
              </svg>
            </svg>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          Share Files Easily,
          <br className="hidden sm:block" />
          <span className="text-primary inline sm:block mt-2 sm:mt-0">
            From Any Device
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-6">
          A simple file sharing solution that works across all your devices.
          Upload, share, and manage files from your computer, phone, or tablet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="buttonGradient w-full sm:w-auto">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 md:mt-16 px-4 sm:px-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 rounded-lg bg-card/80 backdrop-blur-lg border border-border hover:bg-card/90 transition-colors"
            >
              <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto text-primary" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
