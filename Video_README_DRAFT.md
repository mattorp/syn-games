#### Pixy 
GUI, great for training the camera and positioning it correctly:

https://docs.pixycam.com/wiki/doku.php?id=wiki:v2:pixy_regular_quick_start

Python (must be run on Linux) to send the data from Pixy to other applications:

https://docs.pixycam.com/wiki/doku.php?id=wiki:v2:building_libpixyusb_as_a_python_module_on_linux

##### VM
- VirtualBox
  - VirtualBox allows docker to access the macs usb devices
  - Free and Open Source

__Note the default image, tinycore, does not use apt-get etc. Use linux mint for now instead.__

On the host:

```bash
brew install virtualbox
```
or find and download virtual box manually

Use VBoxManages GUI to create the VM. The commented out code is for the terminal. Which I have not gotten to work for mint. 

[] Try to replace SATA/IDE with SATA/IDE controller 

<!-- Create a new VM with liux installed. Example

https://antixlinux.com/torrent-files/


Create the vm

```bash
export VM_NAME=pixy
export VM_ISO=~/Downloads/linuxmint-20.1-cinnamon-64bit-2.iso

# export VM_ISO=~/downloads/antiX-19.3_x64-base.iso
VBoxManage createvm --name $VM_NAME --ostype "Other_Linux_64" --register --basefolder `pwd` 
VBoxManage modifyvm $VM_NAME --ioapic on                     
VBoxManage modifyvm $VM_NAME --memory 256 --vram 128       
VBoxManage modifyvm $VM_NAME --nic1 nat 
sudo usermod -a -G disk $VM_NAME
sudo vboxmanage createmedium disk --filename /var/disk.vdi --size 16000
VBoxManage list hdds
```

export the uuid from the list commad

```bash
export HDD_UUID=
```

```
VBoxManage storagectl $VM_NAME --name "SATA" --add sata --controller IntelAhci       
VBoxManage storageattach $VM_NAME --storagectl "SATA" --port 0 --device 0 --type hdd --medium $HDD_UUID    
VBoxManage storagectl $VM_NAME --name "IDE" --add ide
VBoxManage storageattach $VM_NAME --storagectl "IDE" --port 1 --device 0 --type dvddrive --medium $VM_ISO             
VBoxManage modifyvm $VM_NAME --boot1 dvd --boot2 disk --boot3 none --boot4 none 
vboxmanage startvm $VM_NAME --type headless
``` -->

__NOTE The install disk might open on a single click depending on the distro__

__For persistant storage__
When the VM spins up, make sure to click the disk to install Linux. Otherwise the OS runs from the disk, which will be ejected on the next restart.

In the VM:
<!-- 
```bash
sudo useradd $VM_NAME
sudo passwd $VM_NAME
sudo su $VM_NAME
``` -->

```bash
sudo apt-get update
sudo visudo
```

Add this to the end of the opened file:

```txt
pixy ALL=(ALL) NOPASSWD:ALL
```

```bash
sudo apt-get install openssh-server
sudo shutdown now
```

On host:
```bash
VBoxManage modifyvm $VM_NAME --natpf1 "ssh,tcp,,'$VM_SSH_PORT',,22"
VBoxManage startvm $VM_NAME --type headless
sudo ssh $VM_NAME@127.0.0.1 -p $VM_SSH_PORT
```

password is possibly pixy (if you set it to this ofc).

[] TODO: find setup for this or alternative that supports apt-get and usb with a smaller distribution than mint

``` bash
vboxmanage modifyvm pixy --usb on
 
vboxmanage list usbhost
```

Use the VendorId and ProductId from the list usbhot
```
vboxmanage usbfilter add 0 --target pixy --name pixy --vendorid 0xb1ac --productid 0xf000
```

__NOTE: Replug the pixy usb after starting the VM__


##### Python
__NOTE: Replug the pixy usb after starting the VM__

```
sudo apt-get install libjack-jackd2-dev portaudio19-dev swig libusb-1.0.0-dev g++ build-essential git python3-pip

sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1

git clone https://github.com/charmedlabs/pixy2.git
cd pixy2/scripts
./build_python_demos.sh
cd ../build/python_demos
echo "requests.post('http://{}:{}/'.format(HOST, PORT),
                    data={'note': blocks[index].m_signature, 'velocity': blocks[index].m_x})" >> get_blocks_python_demo.py
sudo python3 get_blocks_python_demo.py
```

__NOTE: Replug the pixy usb after starting the VM__ Segmentation fault will be caused by not doing this.

When returning later use this: 
``` 
cd pixy2/build/python_demos
sudo python3 get_blocks_python_demo.py
```

#### Local network (including host)
Add network adapter with bridged / host only network for the VM

The HOST is the hosts local ip (not tied to the VM)

To ping the host:
```python
from requests import post
from sys import argv

if __name__ == '__main__':
  post('http://{}:{}'.format(argv[1], argv[2]),data={'note': 30, 'velocity': 40})
```

To visualise the points. Add the following to the .glsl file of the scene -- some may already have drawCircle defined. Just delete oone of the functions then.

```glsl
float drawCircle(vec2 position, float size){
    if (distance(_uvc, position)<size){
        return 1.0;
    }
    return 0.0;
}

vec4 getCircle(vec2 position, float circleSize) {
    vec3 backgroundColor = vec3(0.0);
    vec3 circleColor = vec3(1.0);

    float insideCircle = drawCircle(position, circleSize);
    vec3 finalColor = backgroundColor*(1.0-insideCircle);

    finalColor += circleColor*insideCircle;

    return vec4(finalColor, 0.0);
}
```

In the render function add:

```glsl
  vec2 circleCenter0 = vec2(x0_location,y0_location);
  vec4 circle0 = getCircle(circleCenter, size0);

  vec2 circleCenter1 = vec2(x1_location,y1_location);
  vec4 circle1 = getCircle(circleCenter, size1);

  vec4 circles = circle0 + circle1
```


#### Access vm from network
Use port forwarding under NAS (probably, needs testing)
Then use the macs local network ip -- ipconfig getifaddr en0

### Web to Syphon

ChromeSyphon from github.

NOTE it does not support 
- const name = () =>, use function name(){}
- let, use var
- template strings ``, use regular strings ''

Access Developer Tools at localhost:8088 (in a separate window)

