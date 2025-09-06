function WarningIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18.02C1.1 19.26 1.98 20.8 3.44 20.8H20.56C22.02 20.8 22.9 19.26 22.18 18.02L13.71 3.86C12.97 2.6 11.03 2.6 10.29 3.86Z" fill="#F59E0B"/>
      <path d="M12 8V13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1.25" fill="#FFFFFF"/>
    </svg>
  );
}

export default WarningIcon;


