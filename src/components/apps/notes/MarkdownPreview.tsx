import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const processMarkdown = async () => {
      const processedContent = await remark()
        .use(remarkHtml, { sanitize: true })
        .use(rehypeHighlight)
        .process(content);
      setHtmlContent(processedContent.toString());
    };

    processMarkdown();
  }, [content]);

  return (
    <div
      className="prose prose-invert max-w-none overflow-auto p-2 leading-relaxed text-gray-300"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownPreview;
