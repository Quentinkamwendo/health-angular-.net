using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Health.API.Models.Domain
{
    public class Patient
    {
        [Required]
        public Guid Id { get; set; }
        public string PatientName { get; set; }
        public string Residence { get; set; }
        public DateTime TreatmentDate { get; set; }
        public string Disease { get; set; }
        public int Age { get; set; }
        public string ImagePath { get; set; }
        [ForeignKey("Doctor")]
        public Guid DoctorId { get; set; }
        [JsonIgnore]
        public Doctor Doctor { get; set; }
    }
}
