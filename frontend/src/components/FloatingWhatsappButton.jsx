import React from "react";

const whatsappIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="h-7 w-7 fill-current"
  >
    <path d="M16.004 4c-6.617 0-12 5.383-12 12a11.92 11.92 0 0 0 1.79 6.222L4 28l5.932-1.773A11.96 11.96 0 0 0 16 28c6.617 0 12-5.383 12-12s-5.383-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10a9.93 9.93 0 0 1-5.053-1.393l-.356-.217-3.503 1.048 1.082-3.418-.233-.363A9.92 9.92 0 0 1 6.004 16c0-5.514 4.486-10 10-10zm-4.387 4.736c-.312 0-.63.003-.905.132-.259.12-.422.383-.572.66-.205.374-.789 2.496.106 4.863.89 2.348 3.025 4.78 6.429 5.924 3.176 1.066 3.744.684 4.422.641.678-.043 2.184-.891 2.495-1.771.311-.88.311-1.635.218-1.771-.094-.135-.353-.217-.741-.379-.389-.162-2.297-1.139-2.651-1.269-.355-.131-.613-.197-.873.197-.26.394-1 1.269-1.225 1.528-.225.26-.451.293-.84.131-.389-.162-1.665-.614-3.173-1.957-1.176-1.049-1.97-2.347-2.195-2.742-.225-.394-.024-.607.169-.785.173-.161.389-.42.519-.629.13-.208.084-.467.007-.629-.075-.162-.662-1.626-.907-2.226-.243-.585-.495-.603-.754-.612z" />
  </svg>
);

const FloatingWhatsappButton = () => {
  const whatsappNumber = "244923456789";
  const message = encodeURIComponent(
    "Olá! Quero saber mais sobre os produtos da LR Store."
  );
  const link = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105"
      aria-label="Conversar via WhatsApp"
    >
      {whatsappIcon}
    </a>
  );
};

export default FloatingWhatsappButton;
