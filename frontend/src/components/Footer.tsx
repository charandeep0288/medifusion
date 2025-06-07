// src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-blue-100 text-gray-700 text-sm text-center py-4 mt-10">
      © {new Date().getFullYear()} Medifusion. All rights reserved.
    </footer>
  );
};

export default Footer;
