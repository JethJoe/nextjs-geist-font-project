"use client"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    column1: [
      { title: "Contact", href: "#" },
      { title: "Help Center", href: "#" },
      { title: "Business Terms and Conditions", href: "#" },
      { title: "Cookies", href: "#" },
      { title: "Refer a Friend", href: "#" },
      { title: "Accessibility Statement", href: "#" },
      { title: "BiteBantu PRO", href: "#" },
      { title: "Evaluation Rules", href: "#" },
      { title: "Become a restaurant or local shop partner", href: "#" },
    ],
    column2: [
      { title: "Consumer Terms and Conditions", href: "#" },
      { title: "Privacy Policy", href: "#" },
      { title: "Company Information", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Coupon Purchase", href: "#" },
      { title: "Groceries", href: "#" },
      { title: "Corporate Customer", href: "#" },
      { title: "BiteBantu Merchant (for Our Restaurant Partners)", href: "#" },
    ],
    column3: [
      { title: "Website Terms of Use", href: "#" },
      { title: "Digital Services Act", href: "#" },
      { title: "Recommended", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Allergens", href: "#" },
      { title: "Press", href: "#" },
      { title: "All cities in Hungary", href: "#" },
    ],
  }

  return (
    <footer className="bg-white border-t mt-16">
      {/* Divider with margin */}
      <div className="w-full h-px bg-gray-200"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div>
            {footerLinks.column1.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="block text-sm text-gray-500 hover:text-[#E32B44] mb-3 transition-colors duration-200"
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Column 2 */}
          <div>
            {footerLinks.column2.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="block text-sm text-gray-500 hover:text-[#E32B44] mb-3 transition-colors duration-200"
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Column 3 */}
          <div>
            {footerLinks.column3.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="block text-sm text-gray-500 hover:text-[#E32B44] mb-3 transition-colors duration-200"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full mb-8"></div>

        {/* Copyright and Logo Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">© {currentYear} BiteBantu</p>
          <div className="flex items-center space-x-6">
            <span className="text-[#E32B44] font-bold text-xl tracking-tight">BiteBantu</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-semibold">Delivery Hero</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
