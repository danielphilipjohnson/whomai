import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
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
      className="prose prose-invert max-w-none p-2 overflow-auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownPreview;