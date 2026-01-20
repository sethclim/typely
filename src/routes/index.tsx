  import { createFileRoute, Link } from '@tanstack/react-router'
  import { useEffect, useState } from 'react';
  import { ResumeDataItemTable } from '../db/tables';
  import ResumeSyncDemo from '../components/demos/ResumeSyncDemo';
import ThemeSwitcherDemo from '../components/demos/ThemeSwitcherDemo';
import AutoReorderDemo from '../components/demos/DragReorderDemo';

  export const Route = createFileRoute('/')({
    component: RouteComponent,
  })

  export const Hero = () => {
    const [onboarded, setOnboarded] = useState(false)

    useEffect(()=>{
      const res = ResumeDataItemTable.getAll();
      const onBoarded = res.length > 0
      setOnboarded(onBoarded)
    },[])

    return (
      <div className="relative w-full h-[70vh] flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-darkest via-darker to-darkest">
        <div className="flex w-full justify-start bg-black/20 backdrop-blur-md min-h-15 items-center p-4">
            <h3 className="text-white text-3xl font-bold">TYPELY</h3>
        </div>
      
        {/* Gradient mesh blobs */}
        <div className="absolute w-[600px] h-[600px] bg-primary/30 rounded-full blur-[150px] -top-40 -left-20" />
        <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] bottom-0 -right-20" />

        <div className='h-full w-full flex items-center justify-center'>

          <div className="relative z-10 text-center px-6 max-w-2xl">
              <h1 className="text-white text-4xl font-bold mb-4">
              Build Beautiful Resumes, Fast
              </h1>

              <p className="text-white/80 text-lg mb-6">
              Create tailored versions for every job without rewriting anything.
              </p>

              <Link
                  to={onboarded ? "/app" : "/onBoarding"}
                  className="px-6 py-3 bg-white text-black font-semibold rounded-xl shadow-md hover:bg-white/90 transition inline-block"
                  >
                  Start Building
              </Link>
          </div>

        </div>

      </div>
    );
  };

  type Feature = {
    title: string;
    description: string;
  };

  const features: Feature[] = [
    {
      title: "Multiple Versions",
      description: "Tailor your resume for every role — update once, sync everywhere.",
    },
    {
      title: "Drag-and-Drop Sections",
      description: "Reorder and organize your resume visually.",
    },
    {
      title: "Clean PDF Export",
      description: "Pixel-perfect export for applications or email.",
    },
    {
      title: "Reusable Sections",
      description: "Keep work experience, projects, and skills modular and reusable.",
    },
  ];

  export const Features = () => {
    return (
      <section className="py-20 bg-darker text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-gradient-to-tr from-dark/20 via-dark/70 to-primary/50 rounded-2xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2 text-mywhite">{feature.title}</h3>
                <p className="text-grey">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  function RouteComponent() {
    return (
      <>
        <div className='grow flex flex-col '>
            <Hero  />

            <div className='flex flex-col p-2 gap-2'>
              <div className='flex h-100'>
                <div className='w-1/2 text-mywhite flex justify-center items-center text-3xl'>
                  Update Once, Update Everywhere
                </div>
                <div className='w-1/2  flex justify-center items-center'>
                  <ResumeSyncDemo />
                </div>
              </div>

              <div className='flex h-100'>
                <div className='w-1/2  flex justify-center items-center'>
                  <ThemeSwitcherDemo />
                </div>
                <div className='w-1/2 text-mywhite flex justify-center items-center text-3xl'>
                  Switch Resume Theme Instantly
                </div>
              </div>

              <div className='flex h-100'>
                <div className='w-1/2 text-mywhite flex justify-center items-center text-3xl'>
                  Drag Reorder Elements
                </div>
                <div className='w-1/2  flex justify-center items-center'>
                  <AutoReorderDemo />
                </div>
              </div>
            </div>

            {/* <Features /> */}
              <div className="flex w-full justify-center items-center  bg-darkest min-h-10">
                <p className="text-white">@sethclim 2025</p>
            </div>
        </div>
      </>
    )
  }
