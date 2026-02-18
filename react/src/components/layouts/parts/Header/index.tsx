import { NavLink } from 'react-router';

const List = [
  {
    id: 1,
    name: 'Home',
    to: '/',
  },
  {
    id: 2,
    name: 'About',
    to: '/about',
  },
  {
    id: 3,
    name: 'Login',
    to: '/login',
  },
  {
    id: 4,
    name: 'Register',
    to: '/register',
  },
];

export const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          {List.map((item) => (
            <li key={item.id}>
              <NavLink
                style={({ isActive }) => ({
                  color: isActive ? 'red' : 'blue',
                })}
                to={item.to}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
