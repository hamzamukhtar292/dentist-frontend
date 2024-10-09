import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';

pdfMake.vfs = pdfFonts.pdfMake.vfs; // Set the PDF fonts

const generatePDF = (patientData: any) => {
  if (patientData) {
    // Format today's date
    const todayDate = moment().format('MMMM D, YYYY');

    // Define the PDF document structure
    const docDefinition = {
      pageOrientation: 'portrait',
      content: [
        {
          text: 'Simple Up Dental Clinic',
          style: 'header',
          alignment: 'center',
          margin: [0, 20, 0, 10],
        },
        {
          text: 'Address: Shadiwal Road, Khojianwali, Gujrat',
          style: 'address',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Phone number: ${patientData.phoneNumber || ''}`,
          style: 'phone',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Date: ${todayDate}`,
          style: 'date',
          alignment: 'right',
          margin: [0, 0, 20, 20],
        },
        {
          text: 'Patient Details',
          style: 'subheader',
          margin: [0, 10, 0, 5],
        },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Patient Name: ', style: 'label' },
                { text: patientData.name || '', style: 'value' },
                '\n',
                { text: 'Age: ', style: 'label' },
                { text: patientData.age || '', style: 'value' },
                '\n',
                { text: 'Phone Number: ', style: 'label' },
                { text: patientData.phoneNumber || '', style: 'value' },
                '\n',
                { text: 'Address: ', style: 'label' },
                { text: patientData.address || '', style: 'value' },
                '\n',
                { text: 'Diagnose: ', style: 'label' },
                { text: patientData.diagnose || '', style: 'value' },
                '\n',
                { text: 'Detailed Diagnose: ', style: 'label' },
                { text: patientData.detailedDiagnose || '', style: 'value' },
                '\n',
                { text: 'Status: ', style: 'label' },
                { text: patientData.status || 'Active', style: 'value' },
                '\n',
                { text: 'Treatment: ', style: 'label' },
                { text: patientData.treatment || '', style: 'value' },
              ],
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          font: 'Helvetica',
        },
        address: {
          fontSize: 12,
          font: 'Helvetica',
        },
        phone: {
          fontSize: 12,
          font: 'Helvetica',
        },
        date: {
          fontSize: 12,
          margin: [0, 0, 20, 0],
          font: 'Helvetica',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 5],
          font: 'Helvetica',
        },
        label: {
          fontSize: 12,
          bold: true,
        },
        value: {
          fontSize: 12,
        },
      },
      defaultStyle: {
        font: 'Helvetica',
      },
    };

    const currentDate = new Date().toISOString().split('T')[0];

  //ts-ignore
    pdfMake.createPdf(docDefinition).download(`${currentDate}_${patientData.phoneNumber}.pdf`);
  } else {
    console.log('No data found for generating the PDF.');
  }
};
