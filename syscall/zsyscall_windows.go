// MACHINE GENERATED BY 'go generate' COMMAND; DO NOT EDIT

package syscall

import "unsafe"
import "syscall"

var _ unsafe.Pointer

var (
	advapi32 = syscall.NewLazyDLL("Advapi32.dll") // hand-edited

	procCreateProcessWithLogonW = advapi32.NewProc("CreateProcessWithLogonW") // hand-edited
)

func CreateProcessWithLogonW(
	username *uint16,
	domain *uint16,
	password *uint16,
	logonFlags uint32,
	appName *uint16,
	commandLine *uint16,
	creationFlags uint32,
	env *uint16,
	currentDir *uint16,
	startupInfo *syscall.StartupInfo,
	outProcInfo *syscall.ProcessInformation,
) (err error) {
	r1, _, e1 := syscall.Syscall12(
		procCreateProcessWithLogonW.Addr(),
		11,
		uintptr(unsafe.Pointer(username)),
		uintptr(unsafe.Pointer(domain)),
		uintptr(unsafe.Pointer(password)),
		uintptr(logonFlags),
		uintptr(unsafe.Pointer(appName)),
		uintptr(unsafe.Pointer(commandLine)),
		uintptr(creationFlags),
		uintptr(unsafe.Pointer(env)),
		uintptr(unsafe.Pointer(currentDir)),
		uintptr(unsafe.Pointer(startupInfo)),
		uintptr(unsafe.Pointer(outProcInfo)),
		0,
	)
	if r1 == 0 {
		if e1 != 0 {
			err = error(e1)
		} else {
			err = syscall.EINVAL
		}
	}
	return
}
