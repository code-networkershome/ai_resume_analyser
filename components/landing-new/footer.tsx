import { Linkedin, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-blue-100 py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <span className="font-bold text-text-primary">ResumeAI</span>
            <span className="text-sm text-text-secondary ml-2">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Terms
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Support
          </a>
        </div>

        {/* Social */}
        <div className="flex items-center gap-4">
          <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
