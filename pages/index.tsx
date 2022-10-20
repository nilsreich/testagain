import type { NextPage } from "next";
import { useEffect, useState, useCallback, useRef } from "react";
import markdown from "remark-parse";

import pdf from "remark-pdf";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Head from "next/head";

declare global {
  interface Window {
    showSaveFilePicker: any;
    showOpenFilePicker: any;
  }
}
const Home: NextPage = () => {
  //Components
  //DropdownMenu in Menubar
  const Menubar = () => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="hover:bg-neutral-800 outline-none hover:text-blue-500">
          File
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-neutral-900 text-xs p-1 text-neutral-400">
            <DropdownMenu.Item
              className="hover:bg-neutral-800 p-1 outline-none"
              onClick={() => openFile()}
            >
              open
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => saveText(content)}
              className="hover:bg-neutral-800 p-1 outline-none"
            >
              save as
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => exportPDF(content)}
              className="hover:bg-neutral-800 p-1 outline-none"
            >
              export PDF
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  };

  //Functions

  //Save editorContent in file
  const saveText = async (content: string) => {
    const fileName = (content: any) => {
      if (content.match(/\#.*/) != null) {
        return content.match(/\#.*/).toString().replace(/ \g/, "").slice(2);
      } else {
        return "NewFile";
      }
    };

    try {
      let options = {
        suggestedName: fileName(content) + ".txt",
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
      };
      const newHandle = await window.showSaveFilePicker(options);
      const writableStream = await newHandle.createWritable();
      await writableStream.write(content);
      await writableStream.close();
    } catch (e) {
      console.log(e);
    }
  };

  //Export editorContent as PDF
  const exportPDF = async (content: string) => {
    const fileName = (content: any) => {
      if (content.match(/\#.*/) != null) {
        return content.match(/\#.*/).toString().replace(/ \g/, "").slice(2);
      } else {
        return "NewFile";
      }
    };

    try {
      let options = {
        suggestedName: fileName(content) + ".pdf",
        types: [
          {
            description: "Adobe Portable Document Format",
            accept: {
              "application/pdf": [".pdf"],
            },
          },
        ],
      };
      const newHandle = await window.showSaveFilePicker(options);
      const writableStream = await newHandle.createWritable();
      const processor = unified().use(markdown).use(pdf, { output: "blob" });
      const doc = await processor.process(content);
      await writableStream.write(doc);
      await writableStream.close();
    } catch (e) {
      console.log(e);
    }
  };

  //Open file
  const openFile = async () => {
    try {
      const [newHandle] = await window.showOpenFilePicker();
      const file = await newHandle.getFile();
      const contents = await file.text();
      setContent(contents);
    } catch (e) {
      console.log(e);
    }
  };
  //render markdown in editor into html in preview
  const renderPreview = async (content: string) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(content);
    setPreview(String(file));
  };

  // Variables
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");

  //Watch editorContent and run preview() markdown2html
  useEffect(() => {
    renderPreview(content);
  }, [content]);

  // Keyboard Shortcuts
  const handleKeyPress = useCallback((e: any) => {
    if ((e.ctrlKey && e.key === "s") === true) {
      e.preventDefault();
      if (inputElement.current != null) {
        saveText(inputElement.current.value);
      }
    }
    if ((e.ctrlKey && e.key === "o") === true) {
      e.preventDefault();

      openFile();
    }
  }, []);
  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
  const inputElement = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <Head>
        <meta name="application-name" content="PWA App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PWA App" />
        <meta name="description" content="Best PWA App in the world" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon.ico"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/icons/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="PWA App" />
        <meta name="twitter:description" content="Best PWA App in the world" />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PWA App" />
        <meta property="og:description" content="Best PWA App in the world" />
        <meta property="og:site_name" content="PWA App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        />
      </Head>
      <div>
        <div className="flex h-screen flex-col">
          <div className="bg-neutral-900 p-1 text-xs pl-2 text-neutral-500 flex gap-4">
            <Menubar />
            <button disabled>Publish</button>
          </div>
          <div className="flex grow overflow-y-scroll bg-neutral-100">
            <textarea
              ref={inputElement}
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="w-1/2 resize-none border-r p-2 outline-none bg-transparent"
            ></textarea>
            <div
              className="w-1/2 p-3 prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: preview }}
            ></div>
          </div>
          <div className="bg-neutral-900 p-1 text-xs text-neutral-500">
            Statusbar
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
