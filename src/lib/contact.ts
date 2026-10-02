export type ContactMessage = { name: string; email: string; subject: string; message: string };

export function validateContactMessage(message: ContactMessage) {
  return (
    Object.values(message).every((value) => value.trim().length > 0) &&
    /^\S+@\S+\.\S+$/.test(message.email)
  );
}
