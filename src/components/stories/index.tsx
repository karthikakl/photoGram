import * as React from 'react';
import story1 from "@/assets/images/story1.jpg";
import story2 from "@/assets/images/story2.jpg";
import story3 from "@/assets/images/story3.jpg";
import story4 from "@/assets/images/story4.jpg";
import story5 from "@/assets/images/story5.jpg";
import story6 from "@/assets/images/story6.jpg"
interface IStoriesProps {
}

const Stories: React.FunctionComponent<IStoriesProps> = (props) => {
  return(<div className='flex justify-between gap-1'>
   <img src={story1} 
   className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'
   />
    <img src={story2} 
   className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'
   />
    <img src={story3} 
   className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'
   />
    <img src={story4} 
   className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'
   />
    <img src={story5} 
   className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'
   />
   <img src={story6} 
   className='w-20 h-20 rounded-full border-4 border-slate-800 object-cover'
   />
   
  </div>)
};

export default Stories;
