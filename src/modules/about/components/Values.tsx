import { ethicsValues } from '@/data/about/content';

export function Values() {
  return (
    <ul className="list">
      {ethicsValues.map((item) => (
        <li key={item.title}>{item.title}</li>
      ))}
    </ul>
  );
}
