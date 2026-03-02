import './globals.css';

export const metadata = {
  title: 'Syed Dilawar - Senior .NET Full Stack Developer',
  description: 'Senior .NET Full Stack Developer with 8+ years of experience building scalable enterprise solutions, cloud applications, and custom software.',
  keywords: ['Senior Developer', '.NET Developer', 'Full Stack', 'ASP.NET Core', 'C#', 'Enterprise Solutions'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}