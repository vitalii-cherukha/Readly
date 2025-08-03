export function renderAvatar(firstName = 'default', lastName = '') {
  let initials = null;

  if (!firstName.trim() && !lastName.trim()) {
    initials = 'default';
    return initials;
  }

  initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  // get dark-like random bg color
  function getRandomDarkColor() {
    const r = Math.floor(Math.random() * 128);
    const g = Math.floor(Math.random() * 128);
    const b = Math.floor(Math.random() * 128);

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  const randBgColor = getRandomDarkColor();

  return `<svg class="avatar" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      <rect width="48" height="48" fill="${randBgColor}" />
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
            font-size="18" font-family="Arial" fill="#fff">
        ${initials}
      </text>
    </svg>
  `;
}
