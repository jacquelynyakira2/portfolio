import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Metamorphosis from "~/components/apps/Metamorphosis";

interface EasterEggNoteProps {
  width?: number;
}

const markdown = `# The Nested Desktop\n\n
Design is a map we redraw each day<br/>
folders within folders, wayfinding by feel.<br/>
We label, we iterate, we tidy, we play <br/>
the mess becomes meaning, the chaos reveals.<br/>
<br/>
When paths loop forever, don't be dismayed;<br/>
depth is discovery — keep following through.<br/>
Clarity isn't found, it's carefully made <br/>
one thoughtful click at a time. By you.`;

const EasterEggNote = ({ width }: EasterEggNoteProps) => {
  return (
    <div className="relative w-full h-full overflow-y-auto bg-c-50">
      {/* Content */}
      <div className="max-w-screen-md mx-auto px-6 pt-2 pb-10">
        {/* Dynamic coded art in circular frame */}
        <div className="flex justify-center mb-4">
          <div
            className="overflow-hidden rounded-full"
            style={{
              width: "200px",
              height: "200px",
              border: "3px solid #fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}
          >
            <Metamorphosis size={200} />
          </div>
        </div>

        <div className="mt-2 text-c-700">
          <div className="markdown poem-serif">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-3 text-xs text-c-500">
          P.S. Take pride in your layers – every nested idea led you here.
        </div>
      </div>
    </div>
  );
};

export default EasterEggNote;
