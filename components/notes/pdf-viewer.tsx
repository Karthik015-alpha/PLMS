export function PdfViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-muted/10">
      <iframe 
        src={url} 
        className="w-full h-full" 
        title="PDF Viewer" 
      />
    </div>
  );
}
