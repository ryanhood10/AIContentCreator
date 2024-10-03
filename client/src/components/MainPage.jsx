import React, { useState, useRef, useEffect } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram, FaTwitter, FaPinterest, FaCamera, FaLinkedin, FaShareAlt, FaPencilAlt, FaClipboardList, FaUsers, FaSmile, FaInfoCircle, FaPaintBrush } from 'react-icons/fa';

const platforms = [
  { name: "LinkedIn", icon: FaLinkedin, characterLimit: 3000 }, // Professional platform
  { name: "Facebook", icon: FaFacebook, characterLimit: 63206 },
  { name: "Instagram", icon: FaInstagram, characterLimit: 2200 },
  { name: "Twitter", icon: FaTwitter, characterLimit: 280 },
];

// Additional platforms that will be revealed when "More" is clicked
const morePlatforms = [
  { name: "YouTube", icon: FaYoutube, characterLimit: 5000 },
  { name: "YouTube Shorts", icon: FaYoutube, characterLimit: 1000 },
  { name: "TikTok", icon: FaTiktok, characterLimit: 150 },
  { name: "Pinterest", icon: FaPinterest, characterLimit: 500 },
];


const tones = ["Not Specified", "Informative", "Humorous", "Inspirational"];

// Main post types (most commonly used by professionals)
const mainPostTypes = [
  "Post/Update Caption",
  "Q&A/Poll",
  "Video Caption",
  "Carousel/Infographic Caption"
];

const morePostTypes = [
  "Meme Caption",
  "Blog Post Teaser",
  "Promotion",
  "Holiday Greeting",
  "Other"
];



function MainPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0].name);
  const [otherPlatform, setOtherPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [typeOfPost, setTypeOfPost] = useState(mainPostTypes[0]); // Default to the first main post type
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [uniqueAngle, setUniqueAngle] = useState("");
  const [characterLimit, setCharacterLimit] = useState(platforms[0].characterLimit);
  const [generatedPost, setGeneratedPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [dallePrompt, setDallePrompt] = useState(""); // State to hold Dalle Prompt content
  const [imageUrl, setImageUrl] = useState(""); // State to hold image URL
  const [isLoadingDalle, setIsLoadingDalle] = useState(false); // State to track Dalle loading
  const [selectedSize, setSelectedSize] = useState("1024x1024"); // Default size option
  const [optimizedPost, setOptimizedPost] = useState("");
  const [customDallePrompt, setCustomDallePrompt] = useState(""); // State to hold custom DALLE prompt
  const [showCustomPromptInput, setShowCustomPromptInput] = useState(false); // State to toggle custom prompt input visibility
  const [imageTitle, setImageTitle] = useState(""); // State to hold the image title
  const [showMore, setShowMore] = useState(false); // State to track if "More" platforms are shown
  const [showMorePostTypes, setShowMorePostTypes] = useState(false); // To track if more post types are shown
  const [otherPostType, setOtherPostType] = useState(""); // State for "Other" input when selected
  const [showOtherPostInput, setShowOtherPostInput] = useState(false); // Show input for "Other"
  
  const handleShowMore = () => {
    setShowMore(!showMore); // Toggle "More" platforms visibility
  };
  const postRef = useRef(null);
  const seoPost = useRef(null);

  useEffect(() => {
    // Load Dalle Prompt from localStorage if available
    const storedDallePrompt = localStorage.getItem("dallePromptFromGPT");
    if (storedDallePrompt) {
      setDallePrompt(storedDallePrompt);
    }
  }, []);

  const handlePlatformChange = (event) => {
    const { value } = event.target;
    if (value === "Other") {
      setOtherPlatform("");
      setSelectedPlatform(value);
      setCharacterLimit(500); // You can adjust this as needed
    } else {
      const selectedPlatform = platforms.find(p => p.name === value);
      setSelectedPlatform(selectedPlatform.name);
      setCharacterLimit(selectedPlatform.characterLimit);
      setOtherPlatform("");
    }
  };

  const handleTypeOfPostChange = (event) => {
    const { value } = event.target;
    setTypeOfPost(value);
    if (value === "Other") {
      setShowOtherPostInput(true); // Show input for "Other"
    } else {
      setShowOtherPostInput(false); // Hide the "Other" input field for other options
    }
  };
  
  // Handle "View More" toggle for post types
  const handleShowMorePostTypes = () => {
    setShowMorePostTypes(!showMorePostTypes); // Toggle "More" post types visibility
  };
  

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleGeneratePost = async () => {
    const platformName = selectedPlatform === "Other" ? otherPlatform : selectedPlatform;
    const options = {
      method: "POST",
      body: JSON.stringify({
        message:
          `Generate a social media post for ${platformName} about ${topic}.\n` +
          `Target Audience: ${targetAudience}\n` +
          `Tone (ignore if no value): ${tone}\n` +
          `Type of Post: ${typeOfPost}\n` +
          `Style:\n` +
          `Length: Keep it concise and engaging (ideally under ${characterLimit} characters for ${platformName}).\n` +
          `Brand Voice: Maintain a consistent brand voice throughout the post.\n` +
          `Additional Details:\n` + additionalDetails +
          `... Be sure to respond with the post in quotation marks, and at the end of your response, give me a short, detailed, and contextually relevant prompt to give to DALLE-3 image generation AI to create a captivating image that complements this post. Please put the DALLE-3 prompt in brackets [], and don't include any other square brackets in your response aside from that prompt. On the DALLE-3 prompt, be sure to specify only 1-2 subjects in the prompt as to reduce hallucination on image creation. `
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://ai-social-media-poster-a1f841196f5b.herokuapp.com/completions",
        // "https://localhost:3001/completions",
        options
      );
      const data = await response.json();
      const messageContent = data.choices[0].message?.content || data.choices[0].message || "";

      // Extract Dalle Prompt using regex
      const regex = /\[(.*?)\]/;
      const extractedPrompt = regex.exec(messageContent);
      if (extractedPrompt) {
        const dallePromptContent = extractedPrompt[1]; // Get the content inside []
        setDallePrompt(dallePromptContent);

        // Save Dalle Prompt to localStorage
        localStorage.setItem("dallePromptFromGPT", dallePromptContent);
      }

      setGeneratedPost(messageContent);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to generate post:", error);
      setIsLoading(false);
    }
  };

  const handleDalleCompletion = async () => {
    // Set loading state to true when starting Dalle completion
    setIsLoadingDalle(true);

    // Fetch function to send Dalle Prompt and selected size to backend for DALLE-3 completion
    const dallePromptFromStorage = localStorage.getItem("dallePromptFromGPT");

    if (dallePromptFromStorage) {
      try {
        // const response = await fetch("https://localhost:3001/dalleCompletion", {
        const response = await fetch("https://ai-social-media-poster-a1f841196f5b.herokuapp.com/dalleCompletion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            dallePrompt: dallePromptFromStorage,
            imageSize: selectedSize // Include selected image size in the request body
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to complete DALLE-3 request");
        }

        const responseData = await response.json();
        const image = responseData.imageUrl;
        setImageUrl(image); // Set the image URL state
        setIsLoadingDalle(false); // Set loading state to false after completing Dalle completion
        console.log("DALLE-3 request sent successfully!");
      } catch (error) {
        console.error("Error completing DALLE-3 request:", error);
        setIsLoadingDalle(false); // Ensure loading state is set to false in case of error
      }
    } else {
      console.error("No Dalle Prompt available in localStorage.");
      setIsLoadingDalle(false); // Ensure loading state is set to false in case of error
    }
  };

  const handleCustomDalleCompletion = async () => {
    if (!customDallePrompt) {
      alert("Please enter a custom prompt");
      return;
    }

    // Set loading state to true when starting Dalle completion
    setIsLoadingDalle(true);

    try {
      const response = await fetch("https://ai-social-media-poster-a1f841196f5b.herokuapp.com/dalleCompletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dallePrompt: customDallePrompt,
          imageSize: selectedSize // Include selected image size in the request body
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete DALLE-3 request");
      }

      const responseData = await response.json();
      const image = responseData.imageUrl;
      setImageUrl(image); // Set the image URL state
      setIsLoadingDalle(false); // Set loading state to false after completing Dalle completion
      console.log("DALLE-3 request sent successfully!");
    } catch (error) {
      console.error("Error completing DALLE-3 request:", error);
      setIsLoadingDalle(false); // Ensure loading state is set to false in case of error
    }
  };

  const formatPost = (text) => {
    if (typeof text !== 'string') return text;

    const formattedText = text.replace(/\n/g, "<br />");
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const toggleAdditionalDetails = () => {
    setShowAdditionalDetails(!showAdditionalDetails);
  };

  const copyGeneratedPost = () => {
    const postText = postRef.current.textContent;
    
    // Regex to match text within quotation marks and square brackets
    const regex = /^"(.*)"\s*\[([^\]]*)\]$/;
    
    // Extract text within quotation marks and remove content within square brackets using regex
    const match = postText.match(regex);
  
    // If there's a match, extract the content within quotes and without square brackets
    let cleanedText = match ? match[1] : postText;
  
    navigator.clipboard.writeText(cleanedText).then(
      () => alert("Copied to clipboard!"),
      (err) => console.error("Failed to copy:", err)
    );
  };
  const copyGeneratedPost2 = () => {
    const postText = seoPost.current.textContent;
    
    // Regex to match text within quotation marks and square brackets
    const regex = /^"(.*)"\s*\[([^\]]*)\]$/;
    
    // Extract text within quotation marks and remove content within square brackets using regex
    const match = postText.match(regex);
  
    // If there's a match, extract the content within quotes and without square brackets
    let cleanedText = match ? match[1] : postText;
  
    navigator.clipboard.writeText(cleanedText).then(
      () => alert("Copied to clipboard!"),
      (err) => console.error("Failed to copy:", err)
    );
  };

  //GEMINI CODE 
  const handleOptimizePost = async () => {
    const postText = postRef.current.textContent;
  
    // Regex to match text within quotation marks and square brackets
    const regex = /^"(.*)"\s*\[([^\]]*)\]$/;
  
    // Extract text within quotation marks and remove content within square brackets using regex
    const match = postText.match(regex);
  
    // If there's a match, extract the content within quotes and without square brackets
    let cleanedText = match ? match[1] : postText;
  
    // Prepare to generate the optimized description
    const platformName = selectedPlatform === "Other" ? otherPlatform : selectedPlatform;
  
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: `Please optimize this ${platformName} post to appear on more results on its platform based on current search trends: ${cleanedText} `,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    setIsLoading(true);
    try {
      console.log("Sending request with options:", options); // Added logging
      const response = await fetch("https://ai-social-media-poster-a1f841196f5b.herokuapp.com/geminiCompletion", options);
      // const response = await fetch("http://localhost:3001/geminiCompletion", options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOptimizedPost(data.text);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to generate optimized post:", error);
      setIsLoading(false);
    }
  };

// Function to download the image
const downloadDalleImage = () => {
  const newWindow = window.open(imageUrl, '_blank');
  newWindow.focus();
};


return (
  <div className="bg-gray-100 min-h-screen min-w-screen flex flex-col items-center justify-center pt-16 md:pt-24">
    <div className="bg-white border-gray-500 max-w-5xl mb-8 md:mb-16  p-8 rounded-xl shadow-xl w-[80%]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center p-2">
        <FaPencilAlt className="inline-block mr-2" /> Social Media Post Generator
        </h1>
        <h2 className="mb-6 text-lg font-light">powered by ChatGPT, DALLE-3, and Gemini</h2>



        {/* Post Content */}
        <div className="mb-4">
          <label className="block font-medium text-lg mb-2">What do you want to post about?</label>
          <input
  className="bg-gray-200 rounded-lg shadow-sm resize-y h-24 w-full border border-gray-300 hover:border-blue-400 hover:border-2 hover:cursor-pointer focus:border-blue-500 focus:cursor-text transition-all duration-200 px-4 py-2 text-base md:text-lg sm:h-32 focus:outline-none"
  type="text"
  placeholder="What do you want to post about?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          
       {/* Platform Selection */}
<div className="col-span-1 mb-4">
  
  <label className="block font-medium text-lg mb-2 bg-slate-100">   <FaShareAlt className="inline-block mr-2" /> Platform</label>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> {/* Using md:grid-cols-2 for medium screens */}
    {platforms.map((p) => (
      <div key={p.name} className="flex text-sm items-center">
        <input
          type="radio"
          id={p.name}
          name="platform"
          value={p.name}
          checked={selectedPlatform === p.name}
          onChange={handlePlatformChange}
          className="mr-2"
        />
        <label htmlFor={p.name} className="flex items-center">
          <p.icon className="mr-1" /> {p.name}
        </label>
      </div>
    ))}
    {/* Show More/Show Less */}
    {!showMore ? (
      <button
        className="text-blue-500 font-medium cursor-pointer"
        onClick={handleShowMore}
      >
        More...
      </button>
    ) : (
      <>
        {morePlatforms.map((p) => (
          <div key={p.name} className="flex text-sm items-center">
            <input
              type="radio"
              id={p.name}
              name="platform"
              value={p.name}
              checked={selectedPlatform === p.name}
              onChange={handlePlatformChange}
              className="mr-2"
            />
            <label htmlFor={p.name} className="flex items-center">
              <p.icon className="mr-1" /> {p.name}
            </label>
          </div>
        ))}
        <button
          className="text-blue-500 font-medium cursor-pointer mt-2"
          onClick={handleShowMore}
        >
          View Less
        </button>
      </>
    )}
  </div>
  <hr className="py-4 mt-4 w-[80%] mx-auto" />
</div>


       {/* Type of Post */}
<div className="col-span-1 mb-4">
  <label className="block font-medium bg-slate-100 text-lg mb-2">  <FaClipboardList className="inline-block mr-2" />Type of Post</label>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> {/* Using md:grid-cols-2 for medium screens */}
    {/* Main post types */}
    {mainPostTypes.map((type) => (
      <div key={type} className="flex text-sm text-start items-center">
        <input
          type="radio"
          id={type}
          name="typeOfPost"
          value={type}
          checked={typeOfPost === type}
          onChange={handleTypeOfPostChange}
          className="mr-2"
        />
        <label htmlFor={type}>{type}</label>
      </div>
    ))}

    {/* Show More/Show Less functionality */}
    {!showMorePostTypes ? (
      <button
        className="text-blue-500 font-medium cursor-pointer"
        onClick={handleShowMorePostTypes}
      >
        More...
      </button>
    ) : (
      <>
        {/* Additional post types */}
        {morePostTypes.map((type) => (
          <div key={type} className="flex text-sm items-center">
            <input
              type="radio"
              id={type}
              name="typeOfPost"
              value={type}
              checked={typeOfPost === type}
              onChange={handleTypeOfPostChange}
              className="mr-2"
            />
            <label htmlFor={type}>{type}</label>
          </div>
        ))}

        {/* "Other" input when selected */}
        {showOtherPostInput && (
          <input
            type="text"
            className="mt-2 bg-gray-200 rounded-lg shadow-sm w-full px-4 py-2 text-base"
            value={otherPostType}
            onChange={(e) => setOtherPostType(e.target.value)}
            placeholder="Enter other post type"
          />
        )}

        {/* View Less button to collapse additional post types */}
        <button
          className="text-blue-500 font-medium cursor-pointer mt-2"
          onClick={handleShowMorePostTypes}
        >
          View Less
        </button>
      </>
    )}
  </div>
  <hr className="py-4 mt-4 w-[80%] mx-auto" />

</div>


</div>

        {/* Target Audience and Tone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-medium text-lg mb-2">  <FaUsers className="inline-block mr-2" /> Target Audience</label>
            <input
              className="bg-gray-200 rounded-lg w-full shadow-sm"
              type="text"
              placeholder="(optional)"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-lg mb-2  ">  <FaSmile className="inline-block mr-2" /> Tone</label>
            <select
              className="bg-gray-200 rounded-lg w-full shadow-sm"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

{/* Unique Angle */}
<div className="mb-4">
<label className="block font-medium text-lg mb-2  ">  <FaPaintBrush className="inline-block mr-2" /> Unique Angle</label>
  <textarea
    className="bg-gray-200 rounded-lg shadow-sm resize-y h-24 w-full border border-gray-300 hover:border-blue-400 hover:border-2 hover:cursor-pointer focus:border-blue-500 focus:cursor-text transition-all duration-200 px-4 py-2 text-base md:text-lg sm:h-32 focus:outline-none"
    placeholder="Enter a unique angle you want to take. (optional)"
    value={uniqueAngle}
    onChange={(e) => setUniqueAngle(e.target.value)}
  />
</div>


        {/* Additional Details */}
 <div className="mb-4">
          <label
            className="block font-medium mb-2 cursor-pointer text-blue-500 active:text-blue-800 hover:text-blue-400"
            onClick={toggleAdditionalDetails}
          >
              <FaInfoCircle className="inline-block mr-2" /> Additional Details (optional)
          </label>
          {showAdditionalDetails && (
            <div className="font-sm text-gray-500 mb-2">
              * Recent trends or news related to the topic.
              <br />
              * Any specific branding guidelines or restrictions.
              <br />
               * Any hyperlinks you want to include.
              <br />
              * Desired posting time (if known).
            </div>
          )}
          <textarea
  className="bg-gray-200 rounded-lg shadow-sm resize-y h-24 w-full border border-gray-300 hover:border-blue-400 hover:border-2 hover:cursor-pointer focus:border-blue-500 focus:cursor-text transition-all duration-200 px-4 py-2 text-base md:text-lg sm:h-32 focus:outline-none"
  placeholder='Additional Details (optional)'
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
          />
        </div>

        {/* Generate Post Button */}
        <button
          className="bg-blue-500 text-white hover:bg-blue-600 py-4 px-4 rounded-full font-medium text-center w-full"
          onClick={handleGeneratePost}
        >
          Generate Post
        </button>

        {isLoading && (
          <div className="flex items-center mt-4">
            <ThreeDots type="ThreeDots" color="#00BFFF" height={80} width={80} className="mr-2" />
            <p>Loading...</p>
          </div>
        )}

        {/* Generated Post */}
        {generatedPost && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Generated Post:</h2>
            <div className="border p-4 rounded-xl shadow-xl w-full mt-2">
              <div className="flex-grow p-10" ref={postRef}>
                {formatPost(generatedPost)}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={copyGeneratedPost}
                  className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-full font-medium"
                >
                  Copy Post
                </button>
                <button
                  onClick={handleOptimizePost}
                  className="bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded-full font-medium"
                >
                  Optimize Post with Gemini
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Optimized Post */}
        {optimizedPost && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Optimized Post:</h2>
            <div className="border p-4 rounded-xl shadow-xl w-full mt-2">
              <p className="text-gray-600 font-mono">
                Search Engine Optimized with Google's Gemini AI
              </p>
              <div className="flex-grow p-10" ref={seoPost}>
                <p>{optimizedPost}</p>
              </div>
              <button
                onClick={copyGeneratedPost2}
                className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-full font-medium mt-4"
              >
                Copy Post
              </button>
            </div>
          </div>
        )}
        
       


        {/* <p className="text-red-400 pt-8 text-center">
          Please note that the character limit varies based on the selected platform.
          <br />
          * If the "Generate Post" button does not return a response, it is because your prompt is too long, or ChatGPT is too busy to perform a request at this time.
        </p> */}
      </div>
    </div>

    <p className="text-blue-400 w-[80%] text-md pb-8 text-center">
          Want to create an image to go along with your post? Continue below.
          </p>

    <div className="bg-white border-gray-500 max-w-5xl mb-16 md:mb-24  p-8 rounded-xl shadow-xl w-[80%]">
    <h2 className="text-4xl font-bold text-center p-2">
        <FaCamera className="inline-block mr-2" /> Image Generator for Post
        </h2>

        {/* DALLE Image */}
        {imageUrl && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Dalle Image:</h2>
            <div className="border p-4 rounded-xl shadow-xl w-full relative mt-2">
              <img src={imageUrl} alt="Dalle AI Generated" className="rounded-xl shadow-xl w-full" />
              <button
                onClick={downloadDalleImage}
                className="absolute bottom-4 right-4 bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-full font-medium"
              >
                Download Image
              </button>
            </div>
          </div>
        )}

        {/* DALLE Prompt */}
        {dallePrompt && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">AI Prompt to Create Image:</h3>
            <div className="border p-4 rounded-xl shadow-xl w-full mt-2">
              <p>{dallePrompt}</p>
              <p className="text-xs text-gray-500 mt-2">
                Want to generate your own custom prompt?{" "}
                <span
                  onClick={() => setShowCustomPromptInput(true)}
                  className="text-blue-500 cursor-pointer underline"
                >
                  Click Here
                </span>
              </p>

              {showCustomPromptInput && (
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    className="bg-gray-200 rounded-lg shadow-sm w-full"
                    value={customDallePrompt}
                    onChange={(e) => setCustomDallePrompt(e.target.value)}
                  />
                  <button
                    onClick={handleCustomDalleCompletion}
                    className="bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded-full font-medium ml-2"
                  >
                    Try Custom Prompt
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Size Selection */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Select Image Size:</h2>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="1024x1024"
              name="imageSize"
              value="1024x1024"
              checked={selectedSize === "1024x1024"}
              onChange={handleSizeChange}
              className="mr-2"
            />
            <label htmlFor="1024x1024">1024x1024 (Square)</label>

            <input
              type="radio"
              id="1792x1024"
              name="imageSize"
              value="1792x1024"
              checked={selectedSize === "1792x1024"}
              onChange={handleSizeChange}
              className="ml-4 mr-2"
            />
            <label htmlFor="1792x1024">1792x1024 (Banner/Header)</label>

            <input
              type="radio"
              id="1024x1792"
              name="imageSize"
              value="1024x1792"
              checked={selectedSize === "1024x1792"}
              onChange={handleSizeChange}
              className="ml-4 mr-2"
            />
            <label htmlFor="1024x1792">1024x1792 (Vertical Display)</label>
          </div>
        </div>

        <button
          className="bg-green-500 text-white hover:bg-green-600 py-4 px-4 rounded-full font-medium text-center w-full mt-4"
          onClick={handleDalleCompletion}
          disabled={!dallePrompt}
        >
          {isLoadingDalle ? (
            <div className="flex items-center justify-center">
              <ThreeDots type="ThreeDots" color="#FFF" height={20} width={20} />
              <span className="ml-2">Generating Image...</span>
            </div>
          ) : (
            "Generate an Image"
          )}
        </button>
        </div>
  </div>
);

}

export default MainPage;
