
import { useEffect, useState } from "react";
import axios from 'axios';
import LoadingModal from "./Loading";

const Content = () => {
    const [result, setResult] = useState([]);
    const [xfile, setfile] = useState();
    const [captionld, setcaptionld] = useState(true)
    const [ imgUrl, setimgUrl]  = useState()
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState('')
    const [theCaption, settheCaption] = useState('')

  console.log("mini", captionld)
    // useEffect(() => {
    //   const delay = 1000;
    //   const timer = setTimeout(() => {
    //     setcaptionld(false);
    //   }, delay)
    //   return () => clearTimeout(timer);
    // }, [])

    const handleChange = (event) => {
        const selectedFile = event.target.files[0];
        setFiles(event.target.files[0])

        if (selectedFile) {
          const reader = new FileReader();
    
          reader.onload = () => {
            const imageUrl = reader.result;
            setfile(imageUrl);
            setimgUrl(imageUrl)
          };
    
          reader.readAsDataURL(selectedFile);
        }
      };


      const ClearHandler = () => {
        setfile(null)
        setResult([])
        settheCaption('')
        setcaptionld(false)
      }


      const handleclarifai = () => {
        setResult([]);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);


        if(files){
            const formData = new FormData();
            formData.append('image', files);

            axios
        .post('https://moxieus.tech/pimus/public/uploadimagerpro', formData)
        .then((response) => {
          
        
        // console.log(); 
        //   start
         // URL of image to use. Change this to your image.
         setUploadedUrl(response.data.data)
  const IMAGE_URL = `https://moxieus.tech/pimus/public/imagepro/${response.data.data}`;
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "clarifai",
      "app_id": "main"
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + 'bcbcc38062cc4b38b5252164804d5143'
      },
      body: raw
  };
  
  fetch(`https://api.clarifai.com/v2/models/general-image-detection/versions/1580bb1932594c93b7e2e04456af7c6f/outputs`, requestOptions)
      .then(response => response.text())
      .then(response => {
    
            const data = JSON.parse(response)
            const regions = data.outputs[0].data.regions;
            const resultList = regions.map(region => {
              const concepts = region.data.concepts;
              const topConcept = concepts[0];
              return `${topConcept.name}`;
            });
            setResult(resultList);

          

      })
      .catch(error => console.log('error', error));
    
  


        //   end
        })
        .catch((error) => {
          console.log(error); // Handle any errors
        });



       

        }
        


      }


     const  handleCaption = () => {

      setcaptionld(false);
        setTimeout(() => {
          setcaptionld(true);
        }, 3000);

const IMAGE_URL = `https://moxieus.tech/pimus/public/imagepro/${uploadedUrl}`;

const raw = JSON.stringify({
  "user_app_id": {
    "user_id": "salesforce",
    "app_id": "blip"
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + 'c9f0ce7014844fcbac49a6e9d8fbb963'
    },
    body: raw
};

fetch(`https://api.clarifai.com/v2/models/general-english-image-caption-blip/versions/cdb690f13e62470ea6723642044f95e4/outputs`, requestOptions)
    .then(response => response.json())
    .then(result => {
       settheCaption(result.outputs[0].data.text.raw)
       
    })
    .catch(error => console.log('error', error));
  
      }




    return (
        <div>
         
                  {/* x */}
            <div className="mt-8 ml-[30em]">
          

<div className="flex space-x-10  mb-10">








</div>
  <div className="flex space-x-4">
    <div>
     
       {
         captionld ?
         theCaption.length === 0 ? (
          <>
         
          </>
        ) : (
          <>
          {
           
            <div className="absolute top-[53%] border-2 w-[30%] mb-4 bg-white">
          <div className="mt-4 font-bold text-yellow-600 mb-2 ">
       <h2>The Caption: {theCaption}</h2>
        </div>
        </div>
          }
        </>
       
        )
         :
         <>
         </>
       }
     
  <div className=" mb-10" >
  <p className="text-xl text-center"> Image processing </p> 
  <p className=" text-center text-yellow-600">[upload image, generate image content and the caption for the image]</p>
  </div>
<div className="h-[30em] ml-[-30px] bg-white overflow-auto border-2 div rounded-md ">
<div className="absolute z-50 top-40 text-yellow-500 font-bold ">
    <label  for="file" className="p-2">Click to upload image</label>
    <input type="file" id="file" onChange={handleChange} className="" hidden name="images" multiple />
</div>
   {xfile && <img src={xfile} alt="Uploaded"  className="h-[100%]  w-[100%]"/>}
     
</div>
{
  result.length === 0 ?
  <>
  <button onClick={handleclarifai} className="hover:bg-yellow-500 mt-4 hover:text-white active:bg-yellow-500 bg-yellow-600 w-[40em] h-[2.5em] border-2 rounded-md"><span className="p-2 font-bold text-white">Identify</span></button>

  </>
  :
  <>
  
  <button onClick={handleCaption} className="hover:bg-yellow-500  mt-4 hover:text-white active:bg-yellow-500 bg-yellow-600 w-[40em] h-[2.5em] border-2 rounded-md font-bold">{
    captionld ?
    <span>Generate caption</span>
    :
    <span>loading ...</span>
  }</button>
  <div>
<button onClick={ClearHandler} className="hover:bg-yellow-500 mt-4 hover:text-white active:bg-yellow-500 bg-yellow-600 w-[40em] h-[2.5em] border-2 rounded-md font-bold">Reset</button>
  </div>
  </>
}

</div>
      {/* loading modular */}
      <div className="mt-40 right-[63em] absolute "> 
        { loading &&  <LoadingModal/>}
      </div>

 {/* //  idenntify property */}
     {
       result.length === 0 ?
       <>
       </>
       :
       <>
       <div className="bg-white border-2 absolute right-[33em]  mt-[28px] overflow-auto">
       <ul className="p-2">
               {result.map((item, index) => (
                 <>
                 <div className="flex mt-4">
                 <div className="bg-yellow-600 h-4 w-4 rounded-lg"></div> <li className="p-2 mt-[-11px] " key={index}>{item}</li>
                 </div>
                 </>
               ))}
             </ul>  
       </div>
       </>
     }

</div>

            </div>

        </div>
    )
}

export default Content