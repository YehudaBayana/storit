package version

// Version represents the build version stamp.
type Version struct {
	CommitHash string `json:"commitHash"`
	CommitDate string `json:"commitDate"`
}
