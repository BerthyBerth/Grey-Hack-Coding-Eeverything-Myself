// Creating important variables
computer = get_shell.host_computer

crypto = include_lib("/lib/crypto.so")
if not crypto then exit("Error: Missing crypto library")

// ----------------------------------------------
// Making life easy by making function to apply style to text

bold = function(_text)

    _text = "<b>" + _text + "</b>"
    return _text

end function

orange = function(_text)

    _text = "<color=orange>" + _text + "</color>"
    return _text

end function

yellow = function(_text)

    _text = "<color=yellow>" + _text + "</color>"
    return _text

end function

// ----------------------------------------------
// If network device is off it will turn it on

CheckNetworkDevices = function()

    _formatOutput = "Interface Chipset Monitor_Mode\n"
    _networkDevices = computer.network_devices
    _optimizedColumns = ""
    _columns = format_columns(_formatOutput + _networkDevices)
    _splitedColumns = _columns.split("\n")
    for i in range(0, _splitedColumns.len - 1)

        if i == 0 then _splitedColumns[i] = bold(_splitedColumns[i])

        _optimizedColumns = _optimizedColumns + _splitedColumns[i] + "\n"

    end for
    print(_optimizedColumns)

    _interface = _networkDevices.split(" ")[0]
    _chipset = _networkDevices.split(" ")[1]
    _monitorMode = _networkDevices.split(" ")[2]

    if _monitorMode != "True" then
        crypto.airmon("start", _interface)
        print(bold("Started " + _interface))
    end if

end function
CheckNetworkDevices()

// ----------------------------------------------
// Show a list of all the networks and make the client select the network he want to use

SelectNetworkAndPrint = function()

    _networks = get_shell.host_computer.wifi_networks("eth0")
    for i in range(0, _networks.len - 1)

        print(bold("[" + (i + 1)+ "] ") + _networks[i].split(" ")[1])

    end for

    _networkSelected = user_input(bold("Network selected : ")).to_int
    if typeof(_networkSelected) != "number" then

        print("\n" + bold("Please enter a number."))
        _networkSelected = SelectNetworkAndPrint()

    end if

    if _networkSelected > _networks.len or _networkSelected < 0 then

        print("\n" + bold("Please enter a number between " + 1 + " and " + _networks.len + "."))
        _networkSelected = SelectNetworkAndPrint()

    end if

    _infoNetworkSelected = _networks[_networkSelected - 1].split(" ")
    print("Paste that command in another Terminal : aireplay -b " + _infoNetworkSelected[0] + " -e " + _infoNetworkSelected[2])

    return _infoNetworkSelected

end function
networkSelected = SelectNetworkAndPrint()

// ----------------------------------------------
// Waiting for client to finish the aireplay and decrypt the password

WaitingAndDecipher = function()

    user_input("Press enter when aireplay stopped, use <u>ctrl + c</u> to stop the aireplay")

    print("/home/" + active_user + "/file.cap")
    print(crypto.aircrack("/home/" + active_user + "/file.cap"))

    computer.connect_wifi("eth0", networkSelected[2], networkSelected[0], crypto.aircrack("/home/" + active_user + "/file.cap"))

end function
WaitingAndDecipher()
