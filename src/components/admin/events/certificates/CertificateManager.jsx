// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Upload, Eye, Check, AlertCircle, Trophy } from 'lucide-react';
// import { useCertificates } from '../../../../lib/hooks/useCertificates';
// import CertificatePreview from './CertificatePreview';
// import { cn } from '../../../../lib/utils';
// import LoadingSpinner from '../../../shared/LoadingSpinner';
// import toast from 'react-hot-toast';

// export default function CertificateManager() {
//   const { eventId, subEventId } = useParams();
//   const { generateCertificates, loading, eligibleStudents, meritStudents } = useCertificates(
//     parseInt(eventId), 
//     parseInt(subEventId)
//   );
//   const [activeTemplate, setActiveTemplate] = useState('participation');
//   const [showPreview, setShowPreview] = useState(false);
//   const [templates, setTemplates] = useState({
//     participation: {
//       file: null,
//       preview: null,
//       positions: null,
//       dimensions: null
//     },
//     merit: {
//       file: null,
//       preview: null,
//       positions: null,
//       dimensions: null
//     }
//   });

//   const handleTemplateUpload = (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
//       toast.error('Please upload a JPEG or PNG image');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       // Create an image to get dimensions
//       const img = new Image();
//       img.onload = () => {
//         setTemplates(prev => ({
//           ...prev,
//           [type]: {
//             ...prev[type],
//             file: file,
//             preview: reader.result,
//             dimensions: {
//               width: img.naturalWidth,
//               height: img.naturalHeight
//             }
//           }
//         }));
//       };
//       img.src = reader.result;
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleGenerate = async () => {
//     const template = templates[activeTemplate];
//     if (!template.file || !template.positions || !template.dimensions) {
//       toast.error('Please complete template setup first');
//       return;
//     }

//     const students = activeTemplate === 'merit' ? meritStudents : eligibleStudents;
//     if (students.length === 0) {
//       toast.error(`No ${activeTemplate === 'merit' ? 'merit' : 'eligible'} students found`);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('templateType', activeTemplate);
//     formData.append('pdfFileInput', template.file);
//     formData.append('event_id', eventId);
//     formData.append('subevent_id', subEventId);
//     formData.append('imageWidth', template.dimensions.width);
//     formData.append('imageHeight', template.dimensions.height);
    
//     // Add positions with original image coordinates
//     Object.entries(template.positions).forEach(([key, value]) => {
//       formData.append(`${key}X`, value.x);
//       formData.append(`${key}Y`, value.y);
//     });

//     try {
//       await generateCertificates(formData);
//       toast.success('Certificates generated successfully');
//     } catch (error) {
//       toast.error('Failed to generate certificates');
//     }
//   };

//   const handleUpdatePositions = (newPositions) => {
//     setTemplates(prev => ({
//       ...prev,
//       [activeTemplate]: {
//         ...prev[activeTemplate],
//         positions: newPositions
//       }
//     }));
//     setShowPreview(false);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex space-x-4 mb-6">
//         <button
//           onClick={() => setActiveTemplate('participation')}
//           className={cn(
//             "btn flex-1",
//             activeTemplate === 'participation' ? 'btn-primary' : 'btn-ghost'
//           )}
//         >
//           <Check className="h-4 w-4 mr-2" />
//           Participation Certificates
//         </button>
//         <button
//           onClick={() => setActiveTemplate('merit')}
//           className={cn(
//             "btn flex-1",
//             activeTemplate === 'merit' ? 'btn-primary' : 'btn-ghost'
//           )}
//         >
//           <Trophy className="h-4 w-4 mr-2" />
//           Merit Certificates
//         </button>
//       </div>

//       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//         <div className="flex items-center space-x-2">
//           <AlertCircle className="h-5 w-5 text-blue-500" />
//           <p className="text-blue-700 dark:text-blue-300">
//             {activeTemplate === 'merit' ? (
//               `${meritStudents.length} students eligible for merit certificates`
//             ) : (
//               `${eligibleStudents.length} students eligible for participation certificates`
//             )}
//           </p>
//         </div>
//       </div>

//       <div className="glass-card">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h3 className="text-lg font-semibold">Template Upload</h3>
//             <p className="text-sm text-gray-600">
//               Upload a template for {activeTemplate} certificates
//             </p>
//           </div>
//           {templates[activeTemplate].file && (
//             <button
//               onClick={() => setShowPreview(true)}
//               className="btn btn-secondary"
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Preview & Position
//             </button>
//           )}
//         </div>

//         <div className="flex items-center justify-center w-full">
//           <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
//             <Upload className="h-8 w-8 text-gray-400" />
//             <span className="mt-2 text-sm text-gray-500">
//               {templates[activeTemplate].file ? 
//                 templates[activeTemplate].file.name : 
//                 'Click to upload template'
//               }
//             </span>
//             <input
//               type="file"
//               className="hidden"
//               accept="image/jpeg,image/png"
//               onChange={(e) => handleTemplateUpload(e, activeTemplate)}
//             />
//           </label>
//         </div>
//       </div>

//       {showPreview && (
//         <CertificatePreview
//           template={templates[activeTemplate]}
//           onClose={() => setShowPreview(false)}
//           onUpdatePositions={handleUpdatePositions}
//           type={activeTemplate}
//         />
//       )}

//       <button
//         onClick={handleGenerate}
//         disabled={!templates[activeTemplate].file || !templates[activeTemplate].positions || loading}
//         className="btn btn-primary w-full"
//       >
//         {loading ? (
//           <>
//             <LoadingSpinner className="h-4 w-4 mr-2" />
//             Generating Certificates...
//           </>
//         ) : (
//           <>
//             <Check className="h-4 w-4 mr-2" />
//             Generate {activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates
//           </>
//         )}
//       </button>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Eye, Check, AlertCircle, Trophy, CheckCircle, Ban } from 'lucide-react';
import { useCertificates } from '../../../../lib/hooks/useCertificates';
import CertificatePreview from './CertificatePreview';
import { cn } from '../../../../lib/utils';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CertificateManager() {
  const { eventId, subEventId } = useParams();
  const { generateCertificates, loading, eligibleStudents, meritStudents, certificateStatus } = useCertificates(
    parseInt(eventId), 
    parseInt(subEventId)
  );
  const [activeTemplate, setActiveTemplate] = useState('participation');
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState({
    participation: {
      file: null,
      preview: null,
      positions: null,
      dimensions: null
    },
    merit: {
      file: null,
      preview: null,
      positions: null,
      dimensions: null
    }
  });

  const handleTemplateUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      toast.error('Please upload a JPEG or PNG image');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Create an image to get dimensions
      const img = new Image();
      img.onload = () => {
        setTemplates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            file: file,
            preview: reader.result,
            dimensions: {
              width: img.naturalWidth,
              height: img.naturalHeight
            }
          }
        }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    const template = templates[activeTemplate];
    if (!template.file || !template.positions || !template.dimensions) {
      toast.error('Please complete template setup first');
      return;
    }

    const students = activeTemplate === 'merit' ? meritStudents : eligibleStudents;
    if (students.length === 0) {
      toast.error(`No ${activeTemplate === 'merit' ? 'merit' : 'eligible'} students found`);
      return;
    }

    const formData = new FormData();
    formData.append('templateType', activeTemplate);
    formData.append('pdfFileInput', template.file);
    formData.append('event_id', eventId);
    formData.append('subevent_id', subEventId);
    formData.append('imageWidth', template.dimensions.width);
    formData.append('imageHeight', template.dimensions.height);
    
    // Add positions with original image coordinates
    Object.entries(template.positions).forEach(([key, value]) => {
      formData.append(`${key}X`, value.x);
      formData.append(`${key}Y`, value.y);
    });

    try {
      await generateCertificates(formData);
      toast.success('Certificates generated successfully');
    } catch (error) {
      toast.error('Failed to generate certificates');
    }
  };

  const handleUpdatePositions = (newPositions) => {
    setTemplates(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        positions: newPositions
      }
    }));
    setShowPreview(false);
  };

  const isTemplateGenerated = (type) => certificateStatus[type];
  const isCurrentTemplateGenerated = isTemplateGenerated(activeTemplate);
  const canGenerate = !isCurrentTemplateGenerated && 
                     templates[activeTemplate].file && 
                     templates[activeTemplate].positions;

  const getCertificateStatusMessage = () => {
    const { participation, merit } = certificateStatus;
    
    if (participation && merit) {
      return {
        type: 'success',
        message: 'Both participation and merit certificates have been generated successfully.',
        icon: CheckCircle
      };
    } else if (participation && !merit) {
      return {
        type: 'warning',
        message: 'Participation certificates have been generated. Merit certificates are pending.',
        icon: AlertCircle
      };
    } else if (!participation && merit) {
      return {
        type: 'warning',
        message: 'Merit certificates have been generated. Participation certificates are pending.',
        icon: AlertCircle
      };
    }
    return null;
  };

  const statusMessage = getCertificateStatusMessage();

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTemplate('participation')}
          className={cn(
            "btn flex-1 relative",
            activeTemplate === 'participation' ? 'btn-primary' : 'btn-ghost'
          )}
          disabled={isTemplateGenerated('participation')}
        >
          <Check className="h-4 w-4 mr-2" />
          Participation Certificates
          {isTemplateGenerated('participation') && (
            <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTemplate('merit')}
          className={cn(
            "btn flex-1 relative",
            activeTemplate === 'merit' ? 'btn-primary' : 'btn-ghost'
          )}
          disabled={isTemplateGenerated('merit')}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Merit Certificates
          {isTemplateGenerated('merit') && (
            <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
          )}
        </button>
      </div>

      {/* Certificate Status Message */}
      {statusMessage && (
        <div className={cn(
          "border rounded-lg p-4",
          statusMessage.type === 'success' 
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
        )}>
          <div className="flex items-center space-x-2">
            <statusMessage.icon className={cn(
              "h-5 w-5",
              statusMessage.type === 'success' ? "text-green-500" : "text-yellow-500"
            )} />
            <p className={cn(
              statusMessage.type === 'success' 
                ? "text-green-700 dark:text-green-300"
                : "text-yellow-700 dark:text-yellow-300"
            )}>
              {statusMessage.message}
            </p>
          </div>
        </div>
      )}

      {/* Current Template Status */}
      {isCurrentTemplateGenerated && (
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Ban className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700 dark:text-gray-300">
              {activeTemplate === 'merit' ? 'Merit' : 'Participation'} certificates have already been generated for this event.
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <p className="text-blue-700 dark:text-blue-300">
            {activeTemplate === 'merit' ? (
              `${meritStudents.length} students eligible for merit certificates`
            ) : (
              `${eligibleStudents.length} students eligible for participation certificates`
            )}
          </p>
        </div>
      </div>

      <div className={cn(
        "glass-card",
        isCurrentTemplateGenerated && "opacity-50 pointer-events-none"
      )}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Template Upload</h3>
            <p className="text-sm text-gray-600">
              Upload a template for {activeTemplate} certificates
            </p>
          </div>
          {templates[activeTemplate].file && (
            <button
              onClick={() => setShowPreview(true)}
              className="btn btn-secondary"
              disabled={isCurrentTemplateGenerated}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview & Position
            </button>
          )}
        </div>

        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {templates[activeTemplate].file ? 
                templates[activeTemplate].file.name : 
                'Click to upload template'
              }
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={(e) => handleTemplateUpload(e, activeTemplate)}
              disabled={isCurrentTemplateGenerated}
            />
          </label>
        </div>
      </div>

      {showPreview && (
        <CertificatePreview
          template={templates[activeTemplate]}
          onClose={() => setShowPreview(false)}
          onUpdatePositions={handleUpdatePositions}
          type={activeTemplate}
        />
      )}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate || loading}
        className={cn(
          "btn w-full",
          isCurrentTemplateGenerated 
            ? "btn-ghost cursor-not-allowed opacity-50" 
            : "btn-primary"
        )}
      >
        {loading ? (
          <>
            <LoadingSpinner className="h-4 w-4 mr-2" />
            Generating Certificates...
          </>
        ) : isCurrentTemplateGenerated ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            {activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates Already Generated
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Generate {activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates
          </>
        )}
      </button>
    </div>
  );
}
