// Animate container fade-in on page load
window.addEventListener("load", () => {
    gsap.from(".container", { duration: 1, opacity: 0, y: 30, ease: "power2.out" });
  });
  
  // Animate button scale on hover
  const analyzeBtn = document.querySelector("button");
  analyzeBtn.addEventListener("mouseenter", () => {
    gsap.to(analyzeBtn, { duration: 0.3, scale: 1.05, ease: "power1.out" });
  });
  analyzeBtn.addEventListener("mouseleave", () => {
    gsap.to(analyzeBtn, { duration: 0.3, scale: 1, ease: "power1.in" });
  });
  
  // File upload (.txt, .pdf, .jpg/.jpeg) handling
  document.getElementById("fileUpload").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
  
    const fileType = file.type;
  
    if (fileType === "text/plain") {
      // Handle .txt files
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("resumeText").value = e.target.result;
      };
      reader.readAsText(file);
  
    } else if (fileType === "application/pdf") {
      // Handle .pdf files using PDF.js
      const reader = new FileReader();
      reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
  
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
          let textContent = "";
          const totalPages = pdf.numPages;
  
          const loadPageText = (pageNum) => {
            return pdf.getPage(pageNum).then((page) => {
              return page.getTextContent().then((text) => {
                text.items.forEach((item) => {
                  textContent += item.str + " ";
                });
              });
            });
          };
  
          const pagePromises = [];
          for (let i = 1; i <= totalPages; i++) {
            pagePromises.push(loadPageText(i));
          }
  
          Promise.all(pagePromises).then(() => {
            document.getElementById("resumeText").value = textContent.trim();
          });
        });
      };
      reader.readAsArrayBuffer(file);
  
    } else if (fileType.startsWith("image/")) {
      alert("📸 OCR for image files (JPG/JPEG) is coming soon!\nPlease upload a .txt or .pdf file for now.");
    } else {
      alert("❌ Unsupported file type. Please upload a .txt, .pdf, .jpg, or .jpeg file.");
    }
  });
  
  // Analyze resume function with result animation
  async function analyzeResume() {
    const role = document.getElementById("jobRole").value;
    const resumeText = document.getElementById("resumeText").value.trim();
    const resultSection = document.getElementById("resultSection");
    const suggestionText = document.getElementById("suggestions");
  
    if (resumeText === "") {
      alert("⚠️ Please paste or upload your resume first.");
      return;
    }
  
    suggestionText.textContent = "⏳ Generating AI suggestions... Please wait.";
    resultSection.classList.remove("hidden");
  
    // Animate result section sliding in and fade-in
    gsap.fromTo(
      resultSection,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  
    try {
      // Dummy suggestions (replace with real API call later)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay
  
      const dummySuggestions = {
        "Front-End Developer":
          "✅ Add more JavaScript or React projects.\n✅ Mention responsive design and performance optimization.\n✅ Highlight UI/UX experience.",
        "Data Analyst":
          "✅ Include tools like SQL, Excel, Power BI, or Python.\n✅ Add data cleaning and dashboard creation experience.\n✅ Showcase problem-solving with real datasets.",
        "UI/UX Designer":
          "✅ Mention wireframing tools like Figma or Adobe XD.\n✅ Talk about design systems and consistency.\n✅ Show understanding of accessibility and user flow.",
      };
  
      suggestionText.textContent = dummySuggestions[role] || "No suggestions available.";
    } catch (error) {
      suggestionText.textContent = "❌ Error generating suggestions.";
    }
  }
  