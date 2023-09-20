# Lottie homes

A platform to search for care homes. This project includes a thematic map with interactive markers an intuitive search and directions functionality and many more features.

### Link to project: [Lottie Homes](https://lottiehome.vercel.app/)
![Searching care homes](lottie-readme.gif?raw=true "Searching care homes")

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## About this project

This is a full-stack Next.js 13 project built with the following features:

- Address to geographic coordinate search, powered by google maps api and react-select
- Themed map with interactive markers to provide relevant information with a smooth and intuitive user experience
- Dynamically generated/displayed user directions and journey information
- Pop-up modal displaying care home information
- Bookmarking feature to save/favourite care homes with protected REST API
- New care home submission form with drag and drop input fields, image previews and data validation
- Next server actions to handle form submission i.e. cloudinary signature auth, image upload and saving to database 
- Responsive and component based design to ensure customisability, reusability and smooth user experience
- Dynamic and mobile friendly navigation menue that displays links based on user status
- Intuitive login, register and logout pages integrated with 'redirects' and callback urls to create a cohesive user experience 
- User authentication with password encryption to secure user credentials
- Role based access (with NextAuth middleware) protects routes based on user status e.g. admin, manager, signed in user

## Optimisations and future features
- Page for users to view favourited homes
- Dynamic markers to higlight favourited homes on the map
- List view for carehomes
- Apply marker clustering to improve map readability 
- Admin interface to view and manage (edit/delete) care home information
- Create site content and site map to support SEO
- Origin control to protect API routes from foreign domain requests
- Request limiting
- Cross-browser testing

## Bugs and issues
- Layering issue when highlighted markers overlap neighbouring markers. The advanced markers are rendered to separate root elements which fixes the layer they are in. This means the render logic has to change so highlighted markers are re-rendered to the top layer.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
