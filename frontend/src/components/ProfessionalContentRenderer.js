import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';

const ProfessionalContentRenderer = ({ content, className = "" }) => {
  const contentRef = useRef(null);
  const [copiedText, setCopiedText] = useState('');

  const processKaTexFormulas = useCallback(() => {
    if (!contentRef.current) return;
    // Find all KaTeX formulas
    const formulas = contentRef.current.querySelectorAll('.katex-formula, [data-formula]');
    formulas.forEach(formula => {
      try {
        const latex = formula.textContent || formula.getAttribute('data-formula');
        if (latex) {
          const rendered = katex.renderToString(latex, {
            throwOnError: false,
            displayMode: formula.classList.contains('display-mode'),
            output: 'html'
          });
          formula.innerHTML = rendered;
          formula.classList.add('processed-formula');
        }
      } catch (error) {
        console.warn('KaTeX rendering error:', error);
        formula.classList.add('formula-error');
        formula.title = 'Formula rendering error';
      }
    });

    // Process inline LaTeX patterns
    const textNodes = getTextNodes(contentRef.current);
    textNodes.forEach(node => {
      const text = node.textContent;
      const latexPattern = /\\([a-zA-Z]+)(\{[^}]*\})*|\\\(([^\\)]+)\\\)|\\\[([^\]]+)\\\]/g;
      
      if (latexPattern.test(text)) {
        const parent = node.parentNode;
        const wrapper = document.createElement('span');
        
        let lastIndex = 0;
        let match;
        latexPattern.lastIndex = 0;
        
        while ((match = latexPattern.exec(text)) !== null) {
          // Add text before match
          if (match.index > lastIndex) {
            wrapper.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }
          
          // Create formula element
          const formulaSpan = document.createElement('span');
          formulaSpan.className = 'inline-formula professional-formula';
          
          try {
            const latex = match[0];
            const rendered = katex.renderToString(latex, {
              throwOnError: false,
              displayMode: latex.startsWith('\\['),
              output: 'html'
            });
            formulaSpan.innerHTML = rendered;
          } catch (error) {
            formulaSpan.textContent = match[0];
            formulaSpan.className += ' formula-error';
            formulaSpan.title = 'Formula rendering error';
          }
          
          wrapper.appendChild(formulaSpan);
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
          wrapper.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        
        parent.replaceChild(wrapper, node);
      }
    });
  }, []);

  const processCodeBlocks = useCallback(() => {
    if (!contentRef.current) return;
    const codeBlocks = contentRef.current.querySelectorAll('pre code, .ql-code-block, code');
    codeBlocks.forEach((block, index) => {
      if (block.closest('.processed-code')) return;
      
      const isInline = block.tagName === 'CODE' && block.parentNode.tagName !== 'PRE';
      
      if (isInline) {
        // Style inline code
        block.className = 'professional-inline-code';
        return;
      }
      
      // Create wrapper for block code
      const wrapper = document.createElement('div');
      wrapper.className = 'professional-code-block';
      
      const header = document.createElement('div');
      header.className = 'code-header';
      
      const language = getCodeLanguage(block);
      const langLabel = document.createElement('span');
      langLabel.className = 'language-label';
      langLabel.textContent = language || 'Code';
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
        Copy
      `;
      
      copyBtn.addEventListener('click', () => copyCode(block, copyBtn, index));
      
      header.appendChild(langLabel);
      header.appendChild(copyBtn);
      
      const codeContainer = document.createElement('div');
      codeContainer.className = 'code-container';
      
      // Apply syntax highlighting
      if (language && hljs.getLanguage(language)) {
        try {
          const highlighted = hljs.highlight(block.textContent, { language });
          block.innerHTML = highlighted.value;
          block.className = `hljs language-${language}`;
        } catch (error) {
          console.warn('Syntax highlighting error:', error);
        }
      } else {
        block.className = 'hljs';
      }
      
      codeContainer.appendChild(block.cloneNode(true));
      wrapper.appendChild(header);
      wrapper.appendChild(codeContainer);
      
      block.parentNode.replaceChild(wrapper, block);
      wrapper.classList.add('processed-code');
    });
  }, []);

  const processTables = useCallback(() => {
    if (!contentRef.current) return;
    const tables = contentRef.current.querySelectorAll('table');
    tables.forEach(table => {
      if (table.closest('.processed-table')) return;
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'professional-table-wrapper';
      
      const tableContainer = document.createElement('div');
      tableContainer.className = 'table-container';
      
      // Apply professional styling
      table.className = 'professional-table';
      
      // Ensure proper header styling
      const thead = table.querySelector('thead');
      if (thead) {
        thead.className = 'table-header';
      }
      
      const tbody = table.querySelector('tbody');
      if (tbody) {
        tbody.className = 'table-body';
      }
      
      // Style cells
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.className = cell.tagName === 'TH' ? 'table-header-cell' : 'table-data-cell';
      });
      
      tableContainer.appendChild(table.cloneNode(true));
      wrapper.appendChild(tableContainer);
      
      table.parentNode.replaceChild(wrapper, table);
      wrapper.classList.add('processed-table');
    });
  }, []);

  const processImages = useCallback(() => {
    if (!contentRef.current) return;
    const images = contentRef.current.querySelectorAll('img');
    images.forEach(img => {
      if (img.closest('.processed-image')) return;
      
      const wrapper = document.createElement('figure');
      wrapper.className = 'professional-image-wrapper';
      
      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';
      
      img.className = 'professional-image';
      img.loading = 'lazy';
      
      imageContainer.appendChild(img.cloneNode(true));
      wrapper.appendChild(imageContainer);
      
      // Add caption if alt text exists
      if (img.alt) {
        const caption = document.createElement('figcaption');
        caption.className = 'image-caption';
        caption.textContent = img.alt;
        wrapper.appendChild(caption);
      }
      
      img.parentNode.replaceChild(wrapper, img);
      wrapper.classList.add('processed-image');
    });
  }, []);

  const processLinks = useCallback(() => {
    if (!contentRef.current) return;
    const links = contentRef.current.querySelectorAll('a');
    links.forEach(link => {
      if (link.closest('.processed-link')) return;
      
      link.className = 'professional-link';
      
      // Add external link icon for external links
      if (link.hostname && link.hostname !== window.location.hostname) {
        link.classList.add('external-link');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        const icon = document.createElement('span');
        icon.className = 'external-link-icon';
        icon.innerHTML = '↗';
        link.appendChild(icon);
      }
      
      link.classList.add('processed-link');
    });
  }, []);

  const processVideos = useCallback(() => {
    if (!contentRef.current) return;
    const videos = contentRef.current.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"], video');
    videos.forEach(video => {
      if (video.closest('.processed-video')) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'professional-video-wrapper';
      
      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';
      
      if (video.tagName === 'IFRAME') {
        video.className = 'professional-iframe';
        videoContainer.appendChild(video.cloneNode(true));
      } else {
        video.className = 'professional-video';
        video.controls = true;
        videoContainer.appendChild(video.cloneNode(true));
      }
      
      wrapper.appendChild(videoContainer);
      video.parentNode.replaceChild(wrapper, video);
      wrapper.classList.add('processed-video');
    });
  }, []);

  const processPDFs = useCallback(() => {
    if (!contentRef.current) return;
    const pdfs = contentRef.current.querySelectorAll('iframe[src*=".pdf"], .pdf-embed');
    pdfs.forEach(pdf => {
      if (pdf.closest('.processed-pdf')) return;
      
      // PDF embeds are already styled from the rich text editor
      pdf.classList.add('processed-pdf');
    });
  }, []);

  const processBlockquotes = useCallback(() => {
    if (!contentRef.current) return;
    const blockquotes = contentRef.current.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
      if (blockquote.closest('.processed-blockquote')) return;
      
      blockquote.className = 'professional-blockquote';
      
      // Add quote icon
      const icon = document.createElement('div');
      icon.className = 'quote-icon';
      icon.innerHTML = '"';
      blockquote.insertBefore(icon, blockquote.firstChild);
      
      blockquote.classList.add('processed-blockquote');
    });
  }, []);

  const processLists = useCallback(() => {
    if (!contentRef.current) return;
    const lists = contentRef.current.querySelectorAll('ul, ol');
    lists.forEach(list => {
      if (list.closest('.processed-list')) return;
      
      list.className = list.tagName === 'UL' ? 'professional-ul' : 'professional-ol';
      
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        item.className = 'professional-list-item';
      });
      
      list.classList.add('processed-list');
    });
  }, []);

  const processContent = useCallback(() => {
    if (!contentRef.current) return;

    // Process KaTeX formulas
    processKaTexFormulas();
    
    // Process code blocks
    processCodeBlocks();
    
    // Process tables
    processTables();
    
    // Process images
    processImages();
    
    // Process links
    processLinks();
    
    // Process videos
    processVideos();
    
    // Process PDFs
    processPDFs();
    
    // Process blockquotes
    processBlockquotes();
    
    // Process lists
    processLists();
  }, [processKaTexFormulas, processCodeBlocks, processTables, processImages, processLinks, processVideos, processPDFs, processBlockquotes, processLists]);

  useEffect(() => {
    if (contentRef.current && content) {
      // Process the content after rendering
      processContent();
    }
  }, [content, processContent]);





  const processTables = () => {
    const tables = contentRef.current.querySelectorAll('table');
    tables.forEach(table => {
      if (table.closest('.processed-table')) return;
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'professional-table-wrapper';
      
      const tableContainer = document.createElement('div');
      tableContainer.className = 'table-container';
      
      // Apply professional styling
      table.className = 'professional-table';
      
      // Ensure proper header styling
      const thead = table.querySelector('thead');
      if (thead) {
        thead.className = 'table-header';
      }
      
      const tbody = table.querySelector('tbody');
      if (tbody) {
        tbody.className = 'table-body';
      }
      
      // Style cells
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.className = cell.tagName === 'TH' ? 'table-header-cell' : 'table-data-cell';
      });
      
      tableContainer.appendChild(table.cloneNode(true));
      wrapper.appendChild(tableContainer);
      
      table.parentNode.replaceChild(wrapper, table);
      wrapper.classList.add('processed-table');
    });
  };

  const processImages = () => {
    const images = contentRef.current.querySelectorAll('img');
    images.forEach(img => {
      if (img.closest('.processed-image')) return;
      
      const wrapper = document.createElement('figure');
      wrapper.className = 'professional-image-wrapper';
      
      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';
      
      img.className = 'professional-image';
      img.loading = 'lazy';
      
      imageContainer.appendChild(img.cloneNode(true));
      wrapper.appendChild(imageContainer);
      
      // Add caption if alt text exists
      if (img.alt) {
        const caption = document.createElement('figcaption');
        caption.className = 'image-caption';
        caption.textContent = img.alt;
        wrapper.appendChild(caption);
      }
      
      img.parentNode.replaceChild(wrapper, img);
      wrapper.classList.add('processed-image');
    });
  };

  const processLinks = () => {
    const links = contentRef.current.querySelectorAll('a');
    links.forEach(link => {
      if (link.closest('.processed-link')) return;
      
      link.className = 'professional-link';
      
      // Add external link icon for external links
      if (link.hostname && link.hostname !== window.location.hostname) {
        link.classList.add('external-link');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        const icon = document.createElement('span');
        icon.className = 'external-link-icon';
        icon.innerHTML = '↗';
        link.appendChild(icon);
      }
      
      link.classList.add('processed-link');
    });
  };

  const processVideos = () => {
    const videos = contentRef.current.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"], video');
    videos.forEach(video => {
      if (video.closest('.processed-video')) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'professional-video-wrapper';
      
      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';
      
      if (video.tagName === 'IFRAME') {
        video.className = 'professional-iframe';
        videoContainer.appendChild(video.cloneNode(true));
      } else {
        video.className = 'professional-video';
        video.controls = true;
        videoContainer.appendChild(video.cloneNode(true));
      }
      
      wrapper.appendChild(videoContainer);
      video.parentNode.replaceChild(wrapper, video);
      wrapper.classList.add('processed-video');
    });
  };

  const processPDFs = () => {
    const pdfs = contentRef.current.querySelectorAll('iframe[src*=".pdf"], .pdf-embed');
    pdfs.forEach(pdf => {
      if (pdf.closest('.processed-pdf')) return;
      
      // PDF embeds are already styled from the rich text editor
      pdf.classList.add('processed-pdf');
    });
  };

  const processBlockquotes = () => {
    const blockquotes = contentRef.current.querySelectorAll('blockquote');
    blockquotes.forEach(blockquote => {
      if (blockquote.closest('.processed-blockquote')) return;
      
      blockquote.className = 'professional-blockquote';
      
      // Add quote icon
      const icon = document.createElement('div');
      icon.className = 'quote-icon';
      icon.innerHTML = '"';
      blockquote.insertBefore(icon, blockquote.firstChild);
      
      blockquote.classList.add('processed-blockquote');
    });
  };

  const processLists = () => {
    const lists = contentRef.current.querySelectorAll('ul, ol');
    lists.forEach(list => {
      if (list.closest('.processed-list')) return;
      
      list.className = list.tagName === 'UL' ? 'professional-ul' : 'professional-ol';
      
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        item.className = 'professional-list-item';
      });
      
      list.classList.add('processed-list');
    });
  };

  // Helper functions
  const getTextNodes = (element) => {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    return textNodes;
  };

  const getCodeLanguage = (codeElement) => {
    const className = codeElement.className;
    const match = className.match(/(?:language-|lang-)(\w+)/);
    return match ? match[1] : null;
  };

  const copyCode = async (codeElement, button, index) => {
    try {
      const code = codeElement.textContent;
      await navigator.clipboard.writeText(code);
      
      const originalHTML = button.innerHTML;
      button.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M10.854 7.146a.5.5 0 0 1 0 .708L7.707 10.5a.5.5 0 0 1-.708-.708L9.293 7.5 6.999 5.207a.5.5 0 1 1 .708-.708l3.147 3.147z"/>
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
        </svg>
        Copied!
      `;
      button.classList.add('copied');
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
      }, 2000);
      
      toast.success('Code copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className={`professional-content-renderer ${className}`}>
      <div 
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content }}
        className="rendered-content"
      />
      
      <style jsx global>{`
        /* Professional Content Renderer Styles */
        .professional-content-renderer {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.7;
          color: #1f2937;
          max-width: none;
        }

        .rendered-content {
          font-size: 16px;
          line-height: 1.8;
        }

        /* Typography */
        .rendered-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #111827;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
        }

        .rendered-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
          color: #1f2937;
          margin: 1.75rem 0 0.75rem 0;
          line-height: 1.3;
          position: relative;
        }

        .rendered-content h2::before {
          content: '';
          position: absolute;
          left: -1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
          border-radius: 2px;
        }

        .rendered-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 0.5rem 0;
          line-height: 1.4;
        }

        .rendered-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #4b5563;
          margin: 1.25rem 0 0.5rem 0;
          line-height: 1.4;
        }

        .rendered-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #6b7280;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }

        .rendered-content h6 {
          font-size: 1rem;
          font-weight: 600;
          color: #9ca3af;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .rendered-content p {
          margin: 1rem 0;
          color: #374151;
          text-align: justify;
          text-justify: inter-word;
        }

        .rendered-content strong {
          font-weight: 600;
          color: #111827;
        }

        .rendered-content em {
          font-style: italic;
          color: #4b5563;
        }

        /* Professional Links */
        .professional-link {
          color: #3b82f6 !important;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          border-bottom: 1px solid transparent;
          position: relative;
        }

        .professional-link:hover {
          color: #1d4ed8 !important;
          border-bottom-color: #3b82f6;
        }

        .external-link-icon {
          margin-left: 0.25rem;
          font-size: 0.875rem;
          opacity: 0.7;
        }

        /* Professional Tables */
        .professional-table-wrapper {
          margin: 2rem 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .table-container {
          overflow-x: auto;
        }

        .professional-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          background: white;
        }

        .table-header-cell {
          background: linear-gradient(135deg, #f9fafb, #f3f4f6);
          color: #111827;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 2px solid #e5e7eb;
          position: relative;
        }

        .table-header-cell::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        }

        .table-data-cell {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
          transition: background-color 0.2s ease;
        }

        .professional-table tbody tr:hover .table-data-cell {
          background-color: #f9fafb;
        }

        .professional-table tbody tr:nth-child(even) .table-data-cell {
          background-color: #fafbfc;
        }

        /* Professional Code Blocks */
        .professional-code-block {
          margin: 1.5rem 0;
          border-radius: 12px;
          overflow: hidden;
          background: #1f2937;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          border: 1px solid #374151;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #374151, #4b5563);
          border-bottom: 1px solid #4b5563;
        }

        .language-label {
          color: #d1d5db;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .copy-code-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #4b5563;
          color: #d1d5db;
          border: 1px solid #6b7280;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-code-btn:hover {
          background: #6b7280;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .copy-code-btn.copied {
          background: #10b981;
          border-color: #059669;
          color: white;
        }

        .code-container {
          padding: 1rem;
          background: #1f2937;
          overflow-x: auto;
        }

        .code-container code {
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #e5e7eb;
          background: none;
          padding: 0;
        }

        .professional-inline-code {
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          color: #dc2626;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875em;
          font-weight: 500;
          border: 1px solid #d1d5db;
        }

        /* Professional Images */
        .professional-image-wrapper {
          margin: 2rem 0;
          text-align: center;
        }

        .image-container {
          display: inline-block;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          background: white;
          padding: 0.5rem;
        }

        .professional-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          display: block;
        }

        .image-caption {
          margin-top: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
          font-style: italic;
          text-align: center;
        }

        /* Professional Blockquotes */
        .professional-blockquote {
          position: relative;
          margin: 2rem 0;
          padding: 1.5rem 2rem 1.5rem 4rem;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-left: 4px solid #3b82f6;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #1e40af;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .quote-icon {
          position: absolute;
          left: 1rem;
          top: 0.5rem;
          font-size: 3rem;
          color: #3b82f6;
          opacity: 0.3;
          font-family: serif;
          line-height: 1;
        }

        /* Professional Lists */
        .professional-ul {
          margin: 1rem 0;
          padding-left: 0;
          list-style: none;
        }

        .professional-ol {
          margin: 1rem 0;
          padding-left: 0;
          list-style: none;
          counter-reset: list-counter;
        }

        .professional-ul .professional-list-item {
          position: relative;
          padding-left: 2rem;
          margin: 0.75rem 0;
          color: #374151;
        }

        .professional-ul .professional-list-item::before {
          content: '';
          position: absolute;
          left: 0.5rem;
          top: 0.75rem;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .professional-ol .professional-list-item {
          position: relative;
          padding-left: 2.5rem;
          margin: 0.75rem 0;
          color: #374151;
          counter-increment: list-counter;
        }

        .professional-ol .professional-list-item::before {
          content: counter(list-counter);
          position: absolute;
          left: 0;
          top: 0;
          width: 1.75rem;
          height: 1.75rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Professional Videos */
        .professional-video-wrapper {
          margin: 2rem 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .video-container {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
        }

        .professional-iframe,
        .professional-video {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Math Formulas */
        .inline-formula {
          display: inline-block;
          margin: 0 0.25rem;
          vertical-align: middle;
        }

        .professional-formula {
          background: linear-gradient(135deg, #fef3c7, #fbbf24);
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 0.375rem 0.75rem;
          position: relative;
          transition: transform 0.2s ease;
        }

        .professional-formula:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }

        .formula-error {
          background: #fee2e2;
          border-color: #ef4444;
          color: #dc2626;
        }

        /* Text alignment utilities */
        .rendered-content .text-left { text-align: left; }
        .rendered-content .text-center { text-align: center; }
        .rendered-content .text-right { text-align: right; }
        .rendered-content .text-justify { 
          text-align: justify; 
          text-justify: inter-word; 
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .rendered-content {
            font-size: 15px;
          }
          
          .rendered-content h1 {
            font-size: 1.875rem;
          }
          
          .rendered-content h2 {
            font-size: 1.5rem;
          }
          
          .professional-blockquote {
            padding: 1rem 1.5rem 1rem 3rem;
          }
          
          .code-header {
            padding: 0.5rem 0.75rem;
          }
          
          .copy-code-btn {
            padding: 0.375rem 0.5rem;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalContentRenderer;