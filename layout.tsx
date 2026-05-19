// This is a clean layout that will override the root layout.
// It ensures that the admin page does not have the website's header or footer.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}