
const Footer = () => {

  return (
    <footer className="footer sm:footer-horizontal bg-base-100 shadow text-base-content items-center p-4 fixed bottom-0 w-full">
      <aside className="grid-flow-col items-center ml-14">
        <svg
  width="36"
  height="36"
  viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg"
  className="inline-block"
>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FF5F6D" />
      <stop offset="55%" stopColor="#FF2D92" />
      <stop offset="100%" stopColor="#8A5DFF" />
    </linearGradient>

    <mask id="bolt-cut" maskUnits="userSpaceOnUse">
      <rect width="64" height="64" fill="#fff" />
      <polygon fill="#000" points="36,12 28,26 34,26 24,44 44,28 36,28" />
    </mask>
  </defs>

  <rect width="64" height="64" rx="12" fill="url(#g)" />
  <path
    d="
      M32 48
      C 22 40, 14 31, 14 22
      C 14 15, 19 10, 26 10
      C 30 10, 32 13, 32 16
      C 32 13, 34 10, 38 10
      C 45 10, 50 15, 50 22
      C 50 31, 42 40, 32 48 Z
    "
    fill="#fff"
    mask="url(#bolt-cut)"
  />
</svg>
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>

      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end items-center mr-14">
         <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="fill-current">
        <path
          d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
      </svg>
    </a>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="fill-current">
        <path
          d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
      </svg>
    </a>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="fill-current">
        <path
          d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
      </svg>
    </a>
      </nav>
    </footer>
  );
};

export default Footer;